/* ======================================================
   COMPUTER SOLUTION BLOG
   blog.js
====================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ===========================
     Current Year
  =========================== */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ===========================
     Smooth Scroll
  =========================== */

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){

    anchor.addEventListener("click", function(e){

      const target = document.querySelector(this.getAttribute("href"));

      if(target){

        e.preventDefault();

        target.scrollIntoView({

          behavior:"smooth",

          block:"start"

        });

      }

    });

  });

  /* ===========================
     Search Box
  =========================== */

  const searchInput = document.querySelector(".search-box input");

  if(searchInput){

    searchInput.addEventListener("keyup",function(){

      const value=this.value.toLowerCase();

      document.querySelectorAll(".blog-card").forEach(function(card){

        const text=card.innerText.toLowerCase();

        if(text.indexOf(value)>-1){

          card.style.display="block";

        }else{

          card.style.display="none";

        }

      });

    });

  }

});


/* ===========================
   Sticky Header Shadow
=========================== */

window.addEventListener("scroll",function(){

  const header=document.getElementById("site-header");

  if(!header) return;

  if(window.scrollY>40){

    header.style.boxShadow="0 10px 30px rgba(0,0,0,.12)";

  }else{

    header.style.boxShadow="none";

  }

});


/* ===========================
   Active TOC Highlight
=========================== */

const sections=document.querySelectorAll("main section[id]");

const tocLinks=document.querySelectorAll(".table-of-contents a");

window.addEventListener("scroll",function(){

  let current="";

  sections.forEach(section=>{

    const top=section.offsetTop-120;

    if(pageYOffset>=top){

      current=section.getAttribute("id");

    }

  });

  tocLinks.forEach(link=>{

    link.classList.remove("active");

    if(link.getAttribute("href")==="#"+current){

      link.classList.add("active");

    }

  });

});
