{
    function openNav() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        var parent  = document.getElementById('mySidenav');
        
        $.post("/Ingredients", {}, function(data){
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

    function closeNav() {
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

    function getRecepees()
    {
        //var selectedIngredients = selectIngredients();
        var selectedIngredients = ["brašno", "mleko", "jaja", "so", "suncokretovo ulje"];
       
        $.get("/Recepees", {}, function(data){    
            var allRecepees = new Array();
            $.each(data, function(index, value){
                    allRecepees.push(data[index]);
            });
            var matchingRecepees  = getMatchedRecepeees(selectedIngredients, allRecepees);
            showMatchedRecepees(matchingRecepees);

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
    
     function getMatchedRecepeees (selectedIngredients, allRecepees)
     {
         var matchedRecepees = new Array();
         for (var i = 0; i<allRecepees.length; i++)
         {   
             var countOfRecIngr = allRecepees[i].ingredients.length;
             var numOfMatched  = countOfRecIngr;

             for (var j=0; j<allRecepees[i].ingredients.length; j++)
             {
                 if($.inArray(allRecepees[i].ingredients[j], selectedIngredients)===-1)
                 {
                     numOfMatched--;
                     break;
                 }
              }
                
              if(numOfMatched===countOfRecIngr)
              {
                matchedRecepees.push(allRecepees[i]);
              }

         }
         return matchedRecepees;
     }    


     function showMatchedRecepees(recepees)
     {
        //ova funckija ce da prosiri desni container za panele i doda mu po jedan panel za svaki recept koji odgovara pretrazi
        //na svaki recept bice omogucen poseban klik i odabir kako bi se videli detalji o istom

        var parent = document.getElementById('panelContainer'); 

        for(var i=0; i<recepees.length; i++)
        {
            var panelChild = document.createElement('div');
            panelChild.classList ="panel panel-success";
            
            var panelHeading = document.createElement('div');
            panelHeading.classList = 'panel-heading';
            panelHeading.innerHTML = recepees[i].name;

            var panelContent =  document.createElement('div');
            panelContent.classList = 'panel-body';
            
            var recepeeImage  = document.createElement('img');
            recepeeImage.classList = "images img-thumbnail";
            recepeeImage.src = recepees[i].image;


            var prepTime = document.createElement('p');
            prepTime.classList = 'prepTimeP';
            prepTime.innerHTML = recepees[i].estimatedTime;

            var moreInfoLink  = document.createElement('button');
            moreInfoLink.innerHTML = "More information";
            var recName = recepees[i].name;

            moreInfoLink.onclick = function(){
                    openRecepee(recName);
            };
              


            panelContent.appendChild(recepeeImage);
            panelContent.appendChild(moreInfoLink);
            panelContent.appendChild(prepTime);
        

            panelChild.appendChild(panelHeading);
            panelChild.appendChild(panelContent);

            parent.appendChild(panelChild);       
        }     
        
     }


     function openRecepee(name)
     {
        //klik na link o vise informacija dovesce u ovu funkciju koja ce da izbaci modal
        //sa svim informacijama o receptu
        $.get("/GetRecepee/"+name,{}, function(data){
            var recepeeName = data.name;
            alert(recepeeName);
        });
     }
 }
    