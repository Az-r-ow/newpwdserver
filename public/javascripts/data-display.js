
// Initialize tooltip
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

// On toggle button click
$('.toggle-btn').click(function() {
  const row = $(`.row-div#${this.id}`).find(`.password`);

  if(row.attr('hidden')){
    row.removeAttr('hidden');
  }else{
    row.attr('hidden', 'true');
  };
  
})


const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// On delete button click
$(".delete-btn").click(async function(){
  swal("Information", "It will be deleted premenantly.", "info").then((value) => {
    if (!value) return;
    let divId = this.id;
    $.post("/home", {deletedItem: divId}).done(async function(){
      $(`#${divId}`).css('background-color', 'red');
      await sleep(1000);
      $(`#${divId}`).remove();
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
