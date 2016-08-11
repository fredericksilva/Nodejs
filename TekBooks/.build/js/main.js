$(document).ready(function(){
    $('.removeBook').click(function(e){
        deleteId = $(this).data('id');
        $.ajax({
            url:'/manage/books/delete/'+deleteId,
            data: {
                _csrf: $("#csrf").val()
            },
            type: 'DELETE',
            success: function(){

            }
        });
        window.location = '/manage/books';
    });

    $('.removeCategory').click(function(e){
        deleteId = $(this).data('id');
        $.ajax({
            url:'/manage/categories/delete/'+deleteId,
            data: {
                _csrf: $("#csrf").val()
            },
            type: 'DELETE',
            success: function(){

            }
        });
        window.location = '/manage/categories';
    });
});