document.addEventListener("DOMContentLoaded", () => {

  /* ========== Inject Footer CSS ========== */
  const style = document.createElement("style");
  style.innerHTML = `

.maaney-footer{
position:relative;
color:#eee;
margin-top:40px;
}

.footer-overlay{
position:absolute;
inset:0;
}

.footer-content{position:relative}

.footer-title{color:#fff;font-size:15px}

.footer-text{font-size:14px;color:#ffffff}

.footer-list{list-style:none;padding:0;font-size:14px;line-height:2}

.footer-list a{color:#bbb;text-decoration:none}

.footer-social{display:flex;gap:14px;margin-top:10px}

.footer-social a{color:#fff;font-size:18px}

.footer-mail{font-size:13px;color:#aaa;margin-top:10px}

.footer-hr{border-color:#333;margin:20px 0}

.footer-copy{font-size:13px;color:#aaa}

.mobile-block{
border-top:1px solid #333;
padding:10px 0;
}

.mobile-block summary{
color:#fff;
font-size:14px;
font-weight:600;
cursor:pointer;
}

.mobile-block a{
display:block;
color:#bbb;
font-size:13px;
margin-top:6px;
text-decoration:none;
}

`;
  document.head.appendChild(style);


  /* ========== Inject Footer HTML ========== */
  const year = new Date().getFullYear();

  const footerHTML = `

`;

  document.body.insertAdjacentHTML("beforeend", footerHTML);


  /* ========== Mobile Accordion ========== */
  document.querySelectorAll(".mobile-block").forEach(block=>{
    block.addEventListener("toggle",function(){
      if(this.open){
        document.querySelectorAll(".mobile-block").forEach(o=>{
          if(o!==this) o.removeAttribute("open");
        });
      }
    });
  });

});
