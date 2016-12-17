/**
 * Created by effywu on 12/4/2016.
 */
(function(exports) {
    function checkTag(newtag,callback){
        //alert("Within checkTag");
        $.get("http://localhost:3000/tags",function (ndata) {
            if (ndata.length==0){
                callback(true);
            }
            for (i=0;i<ndata.length;i++){
                if (ndata[i].name==newtag){
                    callback(false);
                    break;
                };
                if (i==ndata.length-1){
                    callback(true);
                }
            }
            // ndata.forEach(function (ntag) {
            //     if (ntag.name==newtag) {
            //         callback(false)
            //     };
            // });
        });
        //alert("success");

    }

    exports.startAddTag=function () {
        $('#addTag').click(function () {
            var newtag=$("#newTag").val();
            if (newtag==""){
                alert("Error: Tag name cannot be empty.");
            } else {
                checkTag(newtag,function (success) {
                    if (success==false){
                        alert("Error: Tag name already exists.");
                    } else {
                        $.post( "http://localhost:3000/tags",{"name":newtag},null,"json");
                        alert("Success: You have added tag "+newtag);
                        window.opener.location.reload(true);
                        window.close();
                    }
                });
            }
        })
    }
})(window)