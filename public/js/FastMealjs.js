{
    function openNav() 
    {

        var parent =  document.getElementById("mySidenav");
        var main = document.getElementById("main");

        if(parent.style.width != "250px")
        {
            parent.style.width = "250px";
            main.style.marginLeft = "250px";
        }
        else
        {
            parent.style.width = "0px";
            main.style.marginLeft = "0px";
        }

        //var parent  = document.getElementById('mySidenav');
       
     
        if($("#mySidenav").has("li").length === 0)
        {
            $.post("/Ingredients", {}, function(data){

            //if(parent.hasChildNodes())
            //{
            //    while(parent.firstChild)
            //        parent.removeChild(parent.firstChild);
            //}

           
                $.each(data, function(index, value){
                    var li  = document.createElement("li");

                    var childDiv = document.createElement("div");
                    childDiv.className="col-sm-12";
                
                    var checkDiv = document.createElement("div");
                    checkDiv.className = "checkbox";

                    var label  = document.createElement("label");

                    var input  = document.createElement("input");
                    input.type = "checkbox";
                    input.id = data[index].name;
                    input.onclick = function(){
                        checkBoxSelect(data[index].name);
                    };
                    //input.value = data[index].name;

                    var span  = document.createElement("span");
                    span.className = "cr";

                    var i  = document.createElement("i");
                    i.classList  = "cr-icon glyphicon glyphicon-ok";

                    label.innerHTML = data[index].name;

                    span.appendChild(i);
                    label.appendChild(input);
                    label.appendChild(span);
                    checkDiv.appendChild(label);
                    childDiv.appendChild(checkDiv);
                    li.appendChild(childDiv);

                    parent.appendChild(li);
                });
            });

        }
    }

    function closeNav()
    {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";
    }

    function checkBoxSelect(ingrName)
    {
       if(document.getElementById(ingrName).checked)
       {
           var ingredientName = ingrName;

           var parent = document.getElementById('cart');

           var childLabel = document.createElement('label');
           childLabel.innerHTML = ingrName;
           childLabel.style.fontSize = 20;
           childLabel.id = "label" + ingrName;
           
           var span =  document.createElement('span');
           
           //span.appendChild(childLabel);
           parent.appendChild(childLabel);
        }
        else 
        {
            var element = document.getElementById("label" + ingrName);
            element.parentNode.removeChild(element);
        }
    }

    function getRecipes()
    {
        //var selectedIngredients = selectIngredients();
        var selectedIngredients = ["brašno", "mleko", "jaja", "so", "suncokretovo ulje"];
       
        $.get("/Recipes", {}, function(data){    
            var allRecipes = new Array();
            $.each(data, function(index, value){
                    allRecipes.push(data[index]);
            });
            var matchingRecipes  = getMatchedRecipes(selectedIngredients, allRecipes);
            showMatchedRecipes(matchingRecipes);

          // window.location.replace("http://stackoverflow.com");
        });   
        closeNav();     
    }

    function selectIngredients()
    {
        var parentContainter = document.getElementById('cart');
        
        var arrayOfingredients = new Array();
        var children = parentContainter.children;
    
        for (var i = 0; i < children.length; i++)
        {
             arrayOfingredients.push(children[i].innerHTML);
        }
            
        return arrayOfingredients;
     }
    
     function getMatchedRecipes (selectedIngredients, allRecipes)
     {
         var matchedRecipes = new Array();
         for (var i = 0; i<allRecipes.length; i++)
         {   
             var countOfRecIngr = allRecipes[i].ingredients.length;
             var numOfMatched  = countOfRecIngr;

             for (var j=0; j<allRecipes[i].ingredients.length; j++)
             {
                 if($.inArray(allRecipes[i].ingredients[j], selectedIngredients)===-1)
                 {
                     numOfMatched--;
                     break;
                 }
              }
                
              if(numOfMatched===countOfRecIngr)
              {
                matchedRecipes.push(allRecipes[i]);
              }

         }
         return matchedRecipes;
     }    


     function showMatchedRecipes(recipes)
     {
        //ova funckija ce da prosiri desni container za panele i doda mu po jedan panel za svaki recept koji odgovara pretrazi
        //na svaki recept bice omogucen poseban klik i odabir kako bi se videli detalji o istom

        var parent = document.getElementById('panelContainer'); 

        if(parent.hasChildNodes())
        {
            while(parent.firstChild)
                parent.removeChild(parent.firstChild);
        }

        for(var i=0; i<recipes.length; i++)
        {
            var panelChild = document.createElement('div');
            panelChild.classList ="panel panel-success";
            
            var panelHeading = document.createElement('div');
            panelHeading.classList = 'panel-heading';
            panelHeading.innerHTML = recipes[i].name;

            var panelContent =  document.createElement('div');
            panelContent.classList = 'panel-body';
            
            var recipeImage  = document.createElement('img');
            recipeImage.classList = "images img-thumbnail";
            recipeImage.src = recipes[i].image;


            var prepTime = document.createElement('p');
            prepTime.classList = 'prepTimeP';
            prepTime.innerHTML = recipes[i].estimatedTime;

            var moreInfoLink  = document.createElement('button');
            moreInfoLink.innerHTML = "More information";
            moreInfoLink.classList = "btn btn-success";
            moreInfoLink.id="moreBtn";
            var recName = recipes[i].name;

            moreInfoLink.onclick = function(){
                    openRecipe(recName);
            };
              

            panelContent.appendChild(recipeImage);
            panelContent.appendChild(moreInfoLink);
            panelContent.appendChild(prepTime);
        

            panelChild.appendChild(panelHeading);
            panelChild.appendChild(panelContent);

            parent.appendChild(panelChild);       
        }     
        
     }


     function openRecipe(name)
     {
        //klik na link o vise informacija dovesce u ovu funkciju koja ce da izbaci modal
        //sa svim informacijama o receptu
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


    
 }
    