$(function() {  //indicate jQuery

  $('#search').keyup(function() {   //keyup tells jQuery to listen to what you type and run this function

    var search_term = $(this).val();

    $.ajax({
      method: 'POST',
      url: '/api/search',
      data: {
        search_term
      },
      dataType: 'json',
      success: function(json) {
        var products = json.hits.hits.map(function(hit) {
          return hit;
        });

        $('#searchResults').empty();
        for (var i = 0; i < products.length; i++) {
          var html = "";
          html += '<div class="col-md-4">';
          html += '<a href="/product/' + products[i]._id + '">';
          html += '<div class="thumbnail">';
          html += '<img src="' +  products[i]._source.image + '">';
          html += '<div class="caption">';
          html += '<h3>' + products[i]._source.name  + '</h3>';
          html += '<p>' +  products[i]._source.category.name  + '</h3>'
          html += '<p>$' +  products[i]._source.price  + '</p>';
          html += '</div></div></a></div>';

          $('#searchResults').append(html);
        }

      },

      error: function(error) {
        console.log(err);
      }
    });
  });

  //for + button
  $(document).on('click', '#plus', function(e) {  //#plus is the id of the form control
    e.preventDefault(); //prevent page refresh
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseInt($('#quantity').val());

    priceValue += parseFloat($('#priceHidden').val());
    quantity += 1;

    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
  });

  //for - button
  $(document).on('click', '#minus', function(e) {
    e.preventDefault();
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseInt($('#quantity').val());

    //prevent 0 and negative quantity
    if (quantity == 1) {
      priceValue = $('#priceHidden').val();
      quantity = 1;
    } else {    // apply subtraction
      priceValue -= parseFloat($('#priceHidden').val());
      quantity -= 1;
    }

    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
  });








})
