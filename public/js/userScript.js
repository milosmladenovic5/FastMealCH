function getRecipe (elem)
{
    var name = elem.id;


      $.get("/GetRecipe/"+name,{}, function(data){
            var recipeName = data.name;
            
            $('#myModalLabel').html(data.name);

            var modBody = document.getElementById("imgContainer");
            
            var imgContainer = document.createElement('img');
            imgContainer.classList = "images img-thumbnail";
            imgContainer.src = data.image;
            imgContainer.id = 'mealImage';

            modBody.appendChild(imgContainer);

            $('#prepTimeSp').html("<p> Preparation time:&nbsp</p>");

            var labelTime = document.createElement('label');
            labelTime.innerHTML = data.estimatedTime;
            labelTime.className = "innerLabels";

            var timeSpan =  document.getElementById('prepTimeSp')
            timeSpan.appendChild(labelTime);


            var ingrParent = document.getElementById("ingredientsParent");
            ingrParent.innerHTML = "<p>Ingredients:</p>";

            var lab = document.createElement('label');
            lab.innerHTML = "&nbsp" + data.ingredients[0];
            lab.className = "innerLabels";

            for (var i=1; i<data.ingredients.length; i++)
            {
                lab.innerHTML = lab.innerHTML + ", " +  data.ingredients[i];
            }
            
            ingrParent.appendChild(lab);

            var descriptionParent = document.getElementById('preparation');
            descriptionParent.innerHTML = data.wayOfPreparation;        


            $('#myModal').modal({show:false});
            $('#myModal').modal('show');

         });
}


function deleteChildren()
{
         $('.modalSpan').empty();
         $('#mealImage').remove();
}

function newRecipe()
{
    var parent = document.getElementById('ingredientsSelect');
    $.post("/Ingredients", {}, function(data){
           $.each(data, function(index, value){
             var option  = document.createElement("option");
             option.value = data[index].name;
             option.innerHTML =  data[index].name;

             parent.appendChild(option);
           });
    });

    $('#myModalNew').modal({show:false});
    $('#myModalNew').modal('show');
}

function submitRecipe()
{
  
    var recipeName = $('#recipeName').val();
    var recipeTime  = $('#recipePrepTime').val();
    var recipeDescription = $('#prepDescription').val();

    var ingredients = new Array();
    var length = $('#ingredientsSelect option').length;


    var parentContainter = document.getElementById('ingredientsSelect');
 
     $('#ingredientsSelect option').each(function() {
        if($(this).is(':selected')) 
           ingredients.push(this.innerHTML);    
    });

    var image = "../images/" + $("#serverFileName").val(); // vidi da li radi ova putanja kad prikazujes

     $.post("/api/submitRecipe", {recipeName:recipeName, recipePrepTime:recipeTime, 'ingredients[]':ingredients, prepDescription:recipeDescription, image:image}, function(data){
        if(data!=null)
            alert("Existing recipe.");

       $('#recipeName').val("");
        $('#recipePrepTime').val("");
        $('#prepDescription').val("");
        $('#ingredientsSelect option').each(function() {
            if($(this).is(':selected')) 
                this.selected = false;  
        });
     });
}

function uploadPic()
{
    // rezultat je u hidden polju u modal-u 
    // valjda mozes njega da iskoristis na istu foru i za profilnu sliku korisnika
    // ako ne pomeri ga samo ili dodaj parametar funkciji za id ili koji k**..
    var inputFile = document.getElementById("addPic");
    if(inputFile.files.length != 0)
    {
        var data = new FormData();
        data.append("pic", inputFile.files[0]);

        jQuery.ajax({
        url: '/api/file_upload',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data){
            //alert(data);
            $("#serverFileName").val(data);
            //alert($("#serverFileName").val());
        }
        });
    }
}