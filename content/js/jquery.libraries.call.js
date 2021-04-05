$(document).ready(function(){

    let dir = document.body.dir ;
    console.log(`${!! (dir == "rtl")}`);
/*
* run fire function of  Jquery owlCarousel plugin
*/ 
    let one = $("#owl-one");
    let two = $("#owl-two");
 
   one.owlCarousel({
                    rtl: !!(dir == "rtl"),
                    loop:true,
                    nav:true,
                    items: 1
                  });

    two.owlCarousel({
        rtl: !!(dir == "rtl"),
        loop:true,
        margin:10,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav:true ,
                center:true ,
                margin: 20 
            },
            576:{
                items:2,
                center:true ,
                margin: 60 
            },
            992:{
                items:3,
                nav:false ,
                margin: 30
            }
        }
    })

                           

    /*
    *  Run fire function of Jquery validation plugin
    */              
    $("#orderForm").validate({
        rules: {
                    name:  { required: true, minlength: 3 },
                    email: { required: true, email: true },
                    message: { required: true, minlength: 25 }
               }
      });

});