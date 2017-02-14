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
           childLabel.id = "label"+ingrName;
           
           var span =  document.createElement('span');
           
           //span.appendChild(childLabel);
           parent.appendChild(childLabel);
        }
        else 
        {
            var element = document.getElementById("label"+ingrName);
            element.parentNode.removeChild(element);
        }
    }
    
}