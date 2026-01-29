
(function(){

  const loader = document.createElement("div");
  loader.id = "maaney-loader";

  loader.innerHTML = `
    <div id="maaney-box">
      <div id="maaney-logo">
  <img src="./logo.png" alt="Maaney Logo">
</div>

      <div class="maaney-spinner"></div>
      <div class="maaney-text">Loading...</div>
    </div>
  `;

  document.body.appendChild(loader);

  const style = document.createElement("style");
  style.innerHTML = `

  #maaney-loader{
    position:fixed;
    inset:0;
    background:#000;
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:999999;
    overflow:hidden;
  }

  #maaney-box{
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:10px;
    transform:scale(.6);
    opacity:0;
    animation:zoomIn .6s ease forwards;
  }

  #maaney-logo{
    color:#fff;
    font-family:Arial,Helvetica,sans-serif;
    letter-spacing:3px;
    font-weight:600;
    font-size:22px;
  }

  .maaney-spinner,
  .maaney-text{
    opacity:0;
  }

  .maaney-spinner{
    width:34px;
    height:34px;
    border:3px solid rgba(255,255,255,.25);
    border-top:3px solid #ff7a00;
    border-radius:50%;
    animation:spin .7s linear infinite;
  }

  .maaney-text{
    color:#fff;
    font-family:Arial;
    font-size:13px;
    letter-spacing:1px;
  }

  @keyframes zoomIn{
    to{
      transform:scale(1);
      opacity:1;
    }
  }

  @keyframes spin{
    to{transform:rotate(360deg);}
  }

  /* Background animation */

  #maaney-loader.bgmove{
    background:linear-gradient(
  90deg,
  #ff6a00,
  #ff8c1a,
  #ffb347,
  #ff8c1a,
  #ff6a00
);

    background-size:300% 100%;
    animation:bgmove 2s linear infinite;
  }

  @keyframes bgmove{
    from{background-position:0% 50%;}
    to{background-position:100% 50%;}
  }
    #maaney-logo img{
  width:160px;
  max-width:70vw;
  animation:maaneyPulse 1.2s ease forwards;
}

/* Zoom in once */

@keyframes maaneyPulse{
  from{
    transform:scale(.6);
    opacity:0;
  }
  to{
    transform:scale(1);
    opacity:1;
  }
}


  `;

  document.head.appendChild(style);

  // Step 2 – start background after zoom
  setTimeout(()=>{
    loader.classList.add("bgmove");
  },600);

  // Step 3 – show spinner + text
  setTimeout(()=>{
    document.querySelector(".maaney-spinner").style.opacity=1;
    document.querySelector(".maaney-text").style.opacity=1;
  },1000);

  // Normal load exit
  window.addEventListener("load",()=>{

    loader.style.transition="opacity .4s ease";
    loader.style.opacity="0";

    setTimeout(()=>{
      loader.remove();
    },400);

  });

})();
