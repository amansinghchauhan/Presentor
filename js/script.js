var image_url;
var diagram = [];
var totalTime = 0;

$(init);
function init() {
    // Set Presentor height
    var windowHeight = $(window).height();
    $(".presentor").css("height", (windowHeight-120)+"px");

    // Working on the Canvas
    var canvas = $(".canvas");
    var tools = $(".tools");
    $(".tool").draggable({
        appendTo: 'body',
        helper: "clone",
        zIndex:100,
        start: function(){
                $(this).hide();  
                image_url= $(this).attr("src");
        },
        stop: function(){
                $(this).show();
                
                }
    });

    $("#settings-box").draggable();
    $("#text-edit-container").draggable();

    canvas.droppable({
        drop: function(event, ui) {
            var node = {
                _id: (new Date).getTime(),
                position: ui.helper.position()
            };
            node.position.left -= canvas.position().left;
            if(ui.helper.hasClass("canvas_text")){
                node.type = "TEXT";
                node.text = ui.helper.text();
                node.font = "Times New Roman";
                node.color = "#191970";
                node.size = "30px";
                node.style = "normal";
                node.weight = "normal";
                node.decoration = "none";
                node.image_url= "images/assets/text.png";
            } else if(ui.helper.hasClass("canvas_image")){
                node.type = "IMAGE";
                node.image_url= image_url;
                node.height="auto";
                node.width="200";
            } else if(ui.helper.hasClass("canvas_pause")){
                node.type = "PAUSE";
                node.image_url= "images/assets/pause.png";
                node.height="auto";
                node.width="0";
            } else if(ui.helper.hasClass("canvas_blank")){
                node.type = "BLANK";
                node.image_url= "images/assets/blank.png";
                node.height="1000";
                node.width="1500";
            } else {
                return;
            }
            node.start_time=totalTime;
            totalTime = totalTime + 1;
            node.end_time=totalTime;
            node.animation_name="fade";
            node.opacity="1";
            diagram.push(node);
            //alert(JSON.stringify(diagram));
            renderDiagram(diagram);
        }
    });

    function renderDiagram(diagram) {
        canvas.empty();
        $('.timeline').empty();
        for(var d in diagram) {
            var node = diagram[d];
            var html = "";
            if(node.type === "TEXT") {
                html = "<p class='animate focusDraggable' style='font-family:"+node.font+"; font-size:"+node.size+"; color:"+node.color+"; font-style:"+node.style+"; text-decoration:"+node.decoration+"; font-weight:"+node.weight+";'>"+node.text+"</p>";
            } else if(node.type === "IMAGE") {
                html = "<img src='"+node.image_url+"' class='animate focusDraggable' style='width:"+node.width+"px; height:"+node.height+"px; opacity:"+node.opacity+";'>";                
            } else if(node.type === "BLANK") {
                html = "<img src='"+node.image_url+"' class='animate focusDraggable' style='width:"+node.width+"px; height:"+node.height+"px; opacity:"+node.opacity+";'>";   
                //Handle Dom Addition for Blank Image
                var dom = $(html).css({
                    "position": "absolute",
                    "top": -100,
                    "left": -100
                }).attr("id", node._id);
                $(".timeline").append("<div class='timeline_box' id='timeline_"+node._id+"'><div class='timeline_box_left'><div class='timeline_image'><img src='"+node.image_url+"'></div></div><div class='timeline_options_right'><div class='timeline_box_row'><span><button class='delete-button' onclick='deleteElement("+node._id+")'>X</button></span><span><button class='settings-button' onclick='openSettings("+node._id+")'>S</button></span></div><div class='timeline_box_row'><span><button class='animate-button play-button' onclick='animateImage()'>A</button></span></div><div class='timeline_box_row'><div class='timeline_box_bottom'><span><button class='minus-button' onclick='lessTime("+node._id+")'>-</button></span><span><button class='timeOption' id='time_"+node._id+"'>"+(node.end_time - node.start_time)+"</button></span><span><button class='plus-button' onclick='moreTime("+node._id+")'>+</button></span></div></div></div></div>");
                canvas.append(dom);
                continue;
            } else if(node.type === "PAUSE") {
                html = "";                
            }
            var dom = $(html).css({
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left
            }).draggable({
                //start: function(event, ui) { $(this).css("z-index", a++); },
                stop: function(event, ui) {
                    console.log(ui);
                    var id = ui.helper.attr("id");
                    for(var i in diagram) {
                        if(diagram[i]._id == id) {
                            diagram[i].position.top = ui.position.top;
                            diagram[i].position.left = ui.position.left;
                        }
                    }
                },
                scroll:false
            }).attr("id", node._id);
            /*
            if(node.text){
                $(".timeline").append("<div class='timeline_box' id='timeline_"+node._id+"'><div class='timeline_box_top'><div class='timeline_image'><img src='"+node.image_url+"'></div><div class='timeline_options_side'><span><button class='delete-button' onclick='deleteElement("+node._id+")'>X</button></span><span><button class='edit-button' onclick='updateText("+node._id+")'>E</button></span><span><button class='settings-button' onclick='changeSettings("+node._id+")'>S</button></span></div></div><div class='clear'></div><div class='timeline_box_bottom'><div class='timeline_options_bottom'><span>a</span><span>a</span><span>a</span><span>a</span><span>a</span></div></div></div>");
            }
            else {*/
                $(".timeline").append("<div class='timeline_box' id='timeline_"+node._id+"'><div class='timeline_box_left'><div class='timeline_image'><img src='"+node.image_url+"'></div></div><div class='timeline_options_right'><div class='timeline_box_row'><span><button class='delete-button' onclick='deleteElement("+node._id+")'>X</button></span><span><button class='settings-button' onclick='openSettings("+node._id+")'>S</button></span></div><div class='timeline_box_row'><span><button class='animate-button play-button' onclick='animateImage()'>A</button></span></div><div class='timeline_box_row'><div class='timeline_box_bottom'><span><button class='minus-button' onclick='lessTime("+node._id+")'>-</button></span><span><button class='timeOption' id='time_"+node._id+"'>"+(node.end_time - node.start_time)+"</button></span><span><button class='plus-button' onclick='moreTime("+node._id+")'>+</button></span></div></div></div></div>");
            //}
            canvas.append(dom);
        }
    }

    $(".close").click(function(e) {
        $("#settings-container").hide();
        $("#text-edit-container").hide();
        $("#openEditText").css("display","none");
    });

    // When the user clicks anywhere outside of the modal, close it
    $(window).click(function(event) {
        if ($(event.target).is("#settings-container") || $(event.target).is("#text-edit-container")) {
            $("#settings-container").hide();
            $("#text-edit-container").hide();
            $("#openEditText").css("display","none");
        }
    });
}

//Animating Image
function animateImage(){
    $(".animate").hide().delay(1000);
    for (var i = 0; i < diagram.length; i++) {
        var animation;
        var cur = diagram[i];
        //alert(JSON.stringify(cur));
        var delayTime= cur.start_time * 1000;
        var duration= (cur.end_time - cur.start_time) * 1000;
        if (!cur.animation_name){
            animation = "fade";
        }
        else{
            animation = cur.animation_name;
        }
        $("#"+cur._id).delay(delayTime).show(animation, duration-100);
    }
    return false;
}

//This function will delete an element from the array
function deleteElement(elementID){
    var currentDuration = 0;
    for (var i = 0; i < diagram.length; i++) {
        var cur = diagram[i];
        if (cur._id == elementID) {
            currentDuration = cur.end_time - cur.start_time;
            for (var j = i; j < diagram.length; j++) {
                var node = diagram[j];
                diagram[j].start_time = diagram[j].start_time - currentDuration;
                diagram[j].end_time = diagram[j].end_time - currentDuration;
                $("#time_"+diagram[j]._id).text(diagram[j].start_time);
            }
            totalTime = totalTime - currentDuration;
            diagram.splice(i, 1);
            break;
        }
    }
    $("#"+elementID).remove();
    $("#timeline_"+elementID).remove();
}

//This function will open up the Text Editing box
function openSettings(elementID){
    $("#settingsElementId").val(elementID);
    var elementType;
    for (var i = 0; i < diagram.length; i++) {
        var node= diagram[i];
        if (node._id == elementID) {
            //Copy values from the array
            $("#settingsElementType").val(node.type);
            $("#selectAnimation").val(node.animation_name);
            $("#selectOpacity").val(node.opacity);
            $("#selectStartTime").val(node.start_time);
            $("#selectEndTime").val(node.end_time);
            $("#selectHeight").val(node.height);
            $("#selectWidth").val(node.width);
            if (node.type === 'BLANK' || node.type === 'PAUSE') {
                $("#selectHeight").attr("disabled","true");
                $("#selectWidth").attr("disabled","true");
                $("#selectAnimation").attr("disabled","true");
            }
            else {
                $("#selectHeight").removeAttr("disabled");
                $("#selectWidth").removeAttr("disabled");
                $("#selectAnimation").removeAttr("disabled");
            }
            elementType=node.type;
            break;
        }
    }
    if (elementType == 'TEXT') {
        $("#openEditText").css("display","block");
    }
    else{
        $("#openEditText").css("display","none");
    }
    $("#settings-container").show(100);
}

//This function will change the Settings
function changeSettings(){
    var elementID = $("#settingsElementId").val();
    for (var i = 0; i < diagram.length; i++) {
        var node= diagram[i];
        if (node._id == elementID) {
            // Change Values in the array
            diagram[i].animation_name=$("#selectAnimation").val();
            diagram[i].opacity=$("#selectOpacity").val();
            diagram[i].shadow=$("#selectShadow").val();
            diagram[i].height=$("#selectHeight").val();
            diagram[i].width=$("#selectWidth").val();

            //Change values in the canvas
            //Set Width
            var width=$("#selectWidth").val();
            if (width == '') {
                width = "auto";
            }
            $("#"+elementID).css("width", width);
            //set Height
            var height=$("#selectHeight").val();
            if (height == '') {
                height = "auto";
            }
            $("#"+elementID).css("height", height);
            $("#"+elementID).css("opacity", diagram[i].opacity);
            $("#settings-container").hide(100);
            $("#openEditText").css("display","none");
            break;
        }
}
}

//This function will open up the Edit Text box
function openEditText(){
    elementID = $("#settingsElementId").val();
    $("#openEditText").css("display","none");
    $("#textEditElementId").val(elementID);
    $(".editTextArea").val($("#"+elementID).text());
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i]._id == elementID) {
            $("#font").val(diagram[i].font);
            $("#fontColor").val(diagram[i].color);
            $("#fontSize").val(diagram[i].size);
            $("#fontStyle").val(diagram[i].style);
            if (diagram[i].weight == "bold") {
                $("#selectBold").attr("checked", true);
            }
            else {
                $("#selectBold").attr("checked", false);
            }
            if (diagram[i].decoration == "underline") {
                $("#selectUnderline").attr("checked", true);
            }
            else {
                $("#selectUnderline").attr("checked", false);
            }
            break;
        }
    }
    $("#settings-container").hide(100);
    $("#text-edit-container").show(100);
}

//This function will Edit the Text
function changeText(){
    elementID = $("#textEditElementId").val();
    var text = $(".editTextArea").val();
    var font = $("#font").val();
    var color = $("#fontColor").val();
    var size = $("#fontSize").val();
    var style = $("#fontStyle").val();
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i]._id == elementID) {
            $("#textEditElementId").val();
            diagram[i].text = text;
            diagram[i].font = font;
            diagram[i].color = color;
            diagram[i].size = size;
            diagram[i].style = style;

            $("#"+elementID).text(diagram[i].text);
            $("#"+elementID).css("font-family", font);
            $("#"+elementID).css("color", color);
            $("#"+elementID).css("font-size", size);
            $("#"+elementID).css("font-style", style);
            if($("#selectBold").is(':checked')) {
                diagram[i].weight = "bold";
                $("#"+elementID).css("font-weight", "bold");
            }
            else{
                diagram[i].weight = "normal";
                $("#"+elementID).css("font-weight", "normal");
            }
            if($("#selectUnderline").is(':checked')) {
                diagram[i].decoration = "underline";
                $("#"+elementID).css("text-decoration", "underline");
            }
            else{
                diagram[i].decoration = "none";
                $("#"+elementID).css("text-decoration", "none");
            }
            break;
        }
        
    }
    $("#text-edit-container").hide(100);
}

//This function will be called to change text from another function
function updateText(elementID, text){
    
}

//Function to reduce time for the elements
function lessTime(elementID){
    var i, j;
    //Get the index of the selected element id
    for (i = 0; i < diagram.length; i++) {
        var cur = diagram[i];
        if (cur._id == elementID) {
            break;
        }
    }

    // reduce the time of all the elements
    for (var j = i; j < diagram.length; j++) {
        var cur = diagram[j];
        
        if (j == i) {
            if (diagram[i].end_time - diagram[i].start_time == 1) {
                return;
            }
            diagram[j].end_time = diagram[j].end_time - 1;   // Decrease end time of current element by 1
            $("#time_"+diagram[j]._id).text(diagram[j].end_time - diagram[j].start_time);
            totalTime--;
            continue;
            }
        diagram[j].start_time = diagram[j].start_time - 1;
        diagram[j].end_time = diagram[j].end_time - 1; 
        //alert(diagram[j]._id);
        $("#time_"+diagram[j]._id).text(diagram[j].end_time - diagram[j].start_time);
    }
}

//Function to add more time to the elements
function moreTime(elementID){
    var i, j;
    //Get the index of the selected element id
    for (i = 0; i < diagram.length; i++) {
        var cur = diagram[i];
        if (cur._id == elementID) {
            break;
        }
    }

    // increase the time of all the elements
    for (var j = i; j < diagram.length; j++) {
        var cur = diagram[j];
        if (j == i) {
            if (diagram[i].end_time - diagram[i].start_time == 10) {
                return;
            }
            diagram[j].end_time = diagram[j].end_time + 1;   // Increase end time of current element by 1
            $("#time_"+diagram[j]._id).text(diagram[j].end_time - diagram[j].start_time);
            totalTime++;
            //alert(diagram[j].end_time);
            continue;
            }
        diagram[j].start_time = diagram[j].start_time + 1;
        diagram[j].end_time = diagram[j].end_time + 1; 
        //alert(diagram[j]._id);
        $("#time_"+diagram[j]._id).text(diagram[j].end_time - diagram[j].start_time);
    }
}


function scrollTimeline(direction) {
        if (direction=='Go_L') {
            $('.timeline').animate({
                scrollLeft: "-=" + 200 + "px"
            });
        }else
        if (direction=='Go_R') {
            $('.timeline').animate({
                scrollLeft: "+=" + 200 + "px"
            });
        }
       }
