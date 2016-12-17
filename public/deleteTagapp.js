/**
 * Created by effywu on 12/4/2016.
 */
(function(exports) {

    exports.startDeleteTag=function () {
        $.get("http://localhost:3000/tags",function (data) {
            data.forEach(function (tag) {
                $("#checkboxes").append('<input type="checkbox" name="tagsToDelete" value="'+tag.id+'">'+tag.name);
            })
        });
        $('#deleteTag').click(function () {
            $("input[name='tagsToDelete']:checked").each(function () {
                    var tagurl="http://localhost:3000/tags/"+$(this).val();
                    $.ajax({
                        url:tagurl,
                        type:'DELETE',
                        success:function (result) {

                        }
                    });
                    //$.delete("http://localhost:3000/tags/"+$(this).val());
            });

                        alert("Success: You have deleted tags");
                        window.opener.location.reload(true);
                        window.close();

        })
    }
})(window)