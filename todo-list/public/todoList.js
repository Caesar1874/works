
function __main() {
    // initialItemGroup();
    // bindEventHover()
    bindEventClick();
}
window.onload = function() {
    __main();
}

function initialItemGroup() {
    var req = {
        method: "GET",
        url : "http://localhost:8000/allTodo",
        callback: initial,
    };

    ajaxGet(req);
}

function initial(res) {
    console.log(res);
    var item = JSON.parse(res);
}

// function bindEventHover() {
//     var item = document.querySelector(".todo-item");
//     item.addEventListener("hover", function(event) {
//         var target =event.target;
//         var doneBtn = target.querySelector(".todo-done");
//         var deleteBtn = target.querySelector(".todo-delete");
//
//         doneBtn.classList.add("show");
//         deleteBtn.classList.add("hide");
//
//     });
// }

function bindEventClick() {
    var container = document.querySelector(".todo-container");

    var addButton = document.querySelector(".todo-input");

    container.addEventListener("click", function(event){

        var target = event.target;
        var classlist = target.classList;

        if(classlist.contains("todo-add")) {
            addHandler(event);
        } else if(classlist.contains("todo-done")) {
            doneHandler(event);
        } else if(classlist.contains("todo-delete")) {
            deleteHandler(event);
        }

    });
}



function addHandler(event) {
    var input = document.querySelector(".todo-input");
    var task = input.value;
    var itemString = `
    <div class="todo-item">
        <span class="todo-task">${task}</span>
        <input type="button" value="&#10003;" class="todo-done">
        <input type="button" value="&#9249;" class="todo-delete">
    </div>
    `;

    // console.log(task);
    var itemGroup = document.querySelector(".todo-itemGroup");
    itemGroup.insertAdjacentHTML("beforeend", itemString);

    input.value = "";

    var req = {
        url: "http://localhost:8000",
        method: "POST",
        contentType: "application/json",
        data: {"task": task},
        callback: function(res) {
            console.log("add", res);
        }
    };

    ajax(req);
}

function doneHandler(event) {
    var target = event.target;
    var task = target.parentElement.querySelector(".todo-task");
    task.classList.add("todo-finished");
}

function deleteHandler (event) {
    var target = event.target;
    var item = target.parentElement;
    item.remove();
}

function ajaxGet(req) {
    var request = new XMLHttpRequest();
    request.open("GET", req.url, true);
    request.onreadystatechange = function() {
        if(request.readyState === 4) {
            req.callback(request.response);
        }
    };
    request.send(null);
    console.log("ajax get");
}

function ajax(req) {
    var request = new XMLHttpRequest();
    request.open(req.method, req.url);
    request.setRequestHeader("Content-Type", req.contentType);
    request.onreadystatechange = function() {
        if(request.readyState === 4) {
            req.callback(request.response);
        }
    };
    request.send(JSON.stringify(req.data));
    console.log("ajax send");
}


