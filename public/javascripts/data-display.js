// Initialize tooltip
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

// On delete button click
$(".delete-btn").click(async function(){
  swal("Information", "It will be deleted premenantly.", "information").then((value) => {
    if (!value) return;
    let divId = this.id;
    $(`#${divId}`).remove();
    $.post("/home", {deletedItem: divId}).done(function(){
    }).fail(function(e){
      console.log("An error has occured : ", e);
    })
  })
});

// On copy button click 
$(".copy-btn").click(async function(){
  let copyText = this.id;
  await navigator.clipboard.writeText(copyText);

  let tooltipElement = $(this)
  let tooltip = bootstrap.Tooltip.getInstance(tooltipElement);

  tooltip.setContent({'.tooltip-inner' : 'Copied !'});
})

$("#sort-form").change(function(){
  console.log("the form has been changed ")
  if($("#search-form").length){
    let urlString = 'http://localhost:3000' + window.location.pathname + '?sort_type=' + $('#data-sort').val()+ '&' + 'user_input=' + $("#user_input").val();
    window.location.replace(urlString);
  }else{
    let urlString = 'http://localhost:3000' + window.location.pathname + '?sort_type=' + $('#data-sort').val();
    window.location.replace(urlString);
  }
})
