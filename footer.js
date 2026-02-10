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
<footer class="maaney-footer poppins-regular " id="bottomFooter" style="
background:
linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)),
url('https://img.freepik.com/premium-vector/black-texture-background-abstract-black-background-black-pattern_672416-233.jpg')
center/cover no-repeat;
border-top-left-radius:8px;
border-top-right-radius:8px;
">

<div class="footer-overlay"></div>

<div class="container footer-content py-4">

<div class="row g-4 d-none d-md-flex">

<div class="col-md-3">
<img src="https://maaney.store/logo.png" style="height:40px;margin-bottom:10px;">
<p class="footer-text">
Maaney Store helps you compare smartphones, explore detailed specifications,
and discover the best online deals with AI-powered summaries and smart
product comparisons.
</p>
</div>

<div class="col-md-3">
<h6 class="footer-title">Quick Links</h6>
<ul class="footer-list">
<li><a href="/">Home</a></li>
<li><a href="/mobiles/mobileU10k">Mobile Phones</a></li>
<li><a href="/categories/electronic/">Electronics</a></li>
<li><a href="/about-us">About Us</a></li>
<li><a href="/contact-us">Contact</a></li>
</ul>
</div>

<div class="col-md-3">
<h6 class="footer-title">Support</h6>
<ul class="footer-list">
<li><a href="/policy">Privacy Policy</a></li>
<li><a href="/terms-use">Terms of Use</a></li>
<li><a href="/sitemap.xml">Sitemap</a></li>
</ul>
</div>

<div class="col-md-3">
<h6 class="footer-title">Follow Us</h6>

<div class="footer-social">
<a href="#"><i class="fab fa-facebook"></i></a>
<a href="#"><i class="fab fa-instagram"></i></a>
<a href="#"><i class="fab fa-twitter"></i></a>
<a href="#"><i class="fab fa-youtube"></i></a>
</div>

<p class="footer-mail">
Email: support@maaney.store
</p>
</div>

</div>

<div class="d-md-none">

<div class="text-center mb-3">
<img src="https://maaney.store/logo.png" style="height:36px;">
<p class="footer-text mt-2">
Compare smartphones and find best deals with Maaney Store.
</p>
</div>

<details class="mobile-block">
<summary>Quick Links</summary>
<a href="/">Home</a>
<a href="/mobiles/mobileU10k">Mobile Phones</a>
<a href="/categories/electronic/">Electronics</a>
<a href="/about-us">About Us</a>
<a href="/contact-us">Contact</a>
</details>

<details class="mobile-block">
<summary>Support</summary>
<a href="/policy">Privacy Policy</a>
<a href="/terms-use">Terms of Use</a>
<a href="/sitemap.xml">Sitemap</a>
</details>

<div class="text-center mt-3">
<div class="footer-social justify-content-center">
<a href="#"><i class="fab fa-facebook"></i></a>
<a href="#"><i class="fab fa-instagram"></i></a>
<a href="#"><i class="fab fa-twitter"></i></a>
<a href="#"><i class="fab fa-youtube"></i></a>
</div>

<p class="footer-mail mt-2">
support@maaney.store
</p>
</div>

</div>

<hr class="footer-hr">

<div class="text-center footer-copy">
© ${year} Maaney Store. All Rights Reserved.
</div>

</div>
</footer>
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
