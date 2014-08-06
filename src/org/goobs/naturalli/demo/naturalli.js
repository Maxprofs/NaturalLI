function displayTruth(source, truthValue) {
  if (source == "none") {
    $("#truth-value").text("Unknown");
    $("#truth-value").removeClass("truth-value-true");
    $("#truth-value").removeClass("truth-value-false");
    $("#truth-value").removeClass("truth-value-error");
    $("#truth-value").addClass("truth-value-unknown");
    $("#truth-value").css("padding-left", "-25px;");
  } else if (truthValue) {
    $("#truth-value").text("True");
    $("#truth-value").removeClass("truth-value-unknown");
    $("#truth-value").removeClass("truth-value-false");
    $("#truth-value").removeClass("truth-value-error");
    $("#truth-value").addClass("truth-value-true");
    $("#truth-value").css("margin-left", "15px");
  } else if (!truthValue) {
    $("#truth-value").text("False");
    $("#truth-value").removeClass("truth-value-unknown");
    $("#truth-value").removeClass("truth-value-true");
    $("#truth-value").removeClass("truth-value-error");
    $("#truth-value").addClass("truth-value-false");
    $("#truth-value").css("padding-left", "10px;");
  }
}

function loadJustification(elements, truthValue, hasTruthValue, inputQuery) {
  if (hasTruthValue) {
  $("#justification-toggle-row").show();
  html = '';
  html = html +'<div class="row"><div class="col-md-8 col-md-offset-2 justification">';

  // Justification Fact
  html = html + '<div class="justification-singleline">';
  html = html + '<span class="justification-singleline-input"> ' + inputQuery + ' </span> is ' + (truthValue) + ' because ';
  if (elements.length == 1) {
    html = html + 'it is in our database.';
  } else {
    html = html + 'we know: <span class="justification-singleline-fact">' + elements[0].gloss + '</span>.';
  }
  html = html + '</div>';

  // Justification Table
  // (table)
  html = html +'<table class="justification-table"><thead><tr>';
  html = html + '<th scope="col" style="width:25%;">Search cost</th>';
  html = html + '<th scope="col" style="width:25%">MacCartney relation</th>';
  html = html + '<th scope="col" style="text-align:left;">Fact</th></tr></thead>';
  html = html +'<tbody>';
  for (var i = 0; i < elements.length; ++i) {
    html = html + '<tr>';
    html = html +'<td>' + elements[i].cost + '</td>';
    html = html +'<td>' + elements[i].incomingRelation + '</td>';
    html = html +'<td style="text-align:left;">' + elements[i].gloss + '</td>';
    html = html +'</tr>';
  }
  html = html + '</tbody></table></div></div>';
  $('#justification-container').html(html);
  console.log($('#justification-container').html());
  }
}

function handleError(message) {
  $("#truth-value").removeClass("truth-value-unknown");
  $("#truth-value").removeClass("truth-value-true");
  $("#truth-value").removeClass("truth-value-false");
  $("#truth-value").addClass("truth-value-error")
  $("#truth-value").html('ERROR <div style="color: black; font-size: 12pt">(' + message + ')<div>');
}

function querySuccess(query) {
  return function(response) {
    console.log(response);
    if (response.success) {
      displayTruth(response.bestResponseSource, response.isTrue);
      loadJustification(response.bestJustification, response.isTrue, response.bestJustification != "none", query);
    } else {
      handleError(response.errorMessage);
    }
  }
}


$(document).ready(function(){
  jQuery.support.cors = true;

  // Justification
  $("#justification-toggle-row").hide();

  // Query submit
  $( "#form-query" ).submit(function( event ) {
    // (don't actually submit anything)
    event.preventDefault();
    // (create a default if not input was given)
    if ( $( '#q' ).val().trim() == '') { $( '#q' ).val('cats have tails'); }
    // (start loading icon)
    $( '#truth-value' ).html('<img src="loading.gif" style="height:75px; margin-top:-35px;"/>');
    // (submit)
    target = $(this).attr('action');
    getData = $(this).serialize();
    $.ajax({
      url: target,
      data: getData,
      dataType: 'json',
      success: querySuccess( $( '#q' ).val() )
    });
  });

  // Query button
  $( "#query-button" ).mousedown(function(event) {
    $( '#query-button' ).css('background', 'darkgray');
  });
  $( document ).mouseup(function(event) {
    $( '#query-button' ).css('background', '');
  });
  $( "#query-button" ).click(function(event) {
    $( "#form-query" ).submit();
  });

  $( "#justification-toggle" ).click(function(event) {
    event.preventDefault();
    $("#justification-container").collapse('toggle');
    if ($('#justification-toggle-icon').hasClass('glyphicon-collapse-down')) {
      $('#justification-toggle-icon').removeClass('glyphicon-collapse-down');
      $('#justification-toggle-icon').addClass('glyphicon-expand');
    } else {
      $('#justification-toggle-icon').removeClass('glyphicon-expand');
      $('#justification-toggle-icon').addClass('glyphicon-collapse-down');
    }
  })
});