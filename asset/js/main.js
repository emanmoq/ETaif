$(document).ready(function () {


$(window).on('scroll', function () {
  if ($(window).scrollTop() > 0) {
    $(".section-header").addClass("sticky");
  } else {
    $(".section-header").removeClass("sticky");
  }
});
});        