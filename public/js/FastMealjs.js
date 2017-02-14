{
 

    $('#selectIngrBtn').click(function(){
       var parent  = document.getElementById('navbar');
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

    });


    
}