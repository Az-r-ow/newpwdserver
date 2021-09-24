$(".delete-btn").click(function(){
  if(!confirm('The following account information will be deletd permenantly.'))return;
  let divId = this.id;
  $(`#${divId}`).remove();
  $.post("/home", {deletedItem: divId}).done(function(){
  }).fail(function(e){
    console.log("An error has occured : ", e);
  })
});

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
