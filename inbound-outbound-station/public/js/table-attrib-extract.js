/**
 * Created by samson.alajede on 12/09/2016.
 *
 * Extracts value of any checked row item in a table
 */

$(document).ready(function() {
    IOS = {
        AllTableItem : $(".allTableItem"),
        TableItem : $('.tableItem'),
        FetchCheckedItemId : function(el, attrib = 'id') {
            var idList = "";
            el.each(function(i) {
                if ($(this).is(':checked')) {
                    idList += (idList === "") ? $(this).data(attrib) : "," + $(this).data(attrib);
                }
            });
            return idList;
        },
        TableItemClick : function(el) {
            var item = 0, chk = 0;
            if (el.prop('checked')){
                IOS.TableItem.each(function(index){
                    item++;
                    if ($(this).prop("checked")){
                        chk++;
                    }
                });
                if (item == chk){
                    IOS.AllTableItem.prop('checked', true);
                }
            }else{
                if(IOS.AllTableItem.prop('checked')){
                    IOS.AllTableItem.prop('checked', false);
                }
            }
        },
        AllTableItemClick : function() {
            if (IOS.AllTableItem.prop('checked')){
                IOS.TableItem.each(function(){
                    $(this).prop('checked', true);
                });
            } else {
                IOS.TableItem.each(function(){
                    $(this).prop('checked', false);
                });
            }
        }
    };

    // table item checkbox click
    $(document).on('click', '.tableItem', function(event){
        IOS.TableItemClick($(this));
    });

    // table item all checkbox click
    $(document).on('click','.allTableItem', function(event){
        IOS.AllTableItemClick();
    });

    $(document).on('click', '.itemBtn', function (e) {
        e.preventDefault();
        var idList = IOS.FetchCheckedItemId(IOS.TableItem);
        if (idList !== "") {
            $(".attribList").val(idList);
            $(".itemForm").submit();
        } else {
            swal("Oops!", "Please select one or more item before proceeding", "error");
        }
    })
});