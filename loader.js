(function(){
  const loader = document.createElement("div");
  loader.id = "maaney-loader";

  loader.innerHTML = `
    <img src="./logo.png" id="maaney-logo">
  `;

  document.body.appendChild(loader);

  const style = document.createElement("style");
  style.innerHTML = `

  #maaney-loader{
    position:fixed;
    inset:0;
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:999999;

    background:linear-gradient(90deg,#000,#ff7a00,#000);
    background-size:300% 100%;
    animation:bgmove 4s infinite linear;
  }

  #maaney-logo{
    width:160px;
    animation: maaneyZoom 1.2s ease forwards;
  }

  /* Logo zoom ONCE */

  @keyframes maaneyZoom{
    0%{
      transform:scale(.5);
      opacity:0;
    }
    100%{
      transform:scale(1);
      opacity:1;
    }
  }

  /* Background left → right forever */

  @keyframes bgmove{
    0%{background-position:0% 50%;}
    100%{background-position:100% 50%;}
  }

  `;

  document.head.appendChild(style);

  // Wait for ALL assets
  function waitForImages(){
    const imgs = document.images;
    let loaded = 0;

    return new Promise(resolve=>{
      if(!imgs.length) resolve();

      for(let img of imgs){
        if(img.complete){
          loaded++;
          if(loaded === imgs.length) resolve();
        }else{
          img.addEventListener("load",check);
          img.addEventListener("error",check);
        }
      }

      function check(){
        loaded++;
        if(loaded === imgs.length) resolve();
      }
    });
  }

  Promise.all([
    new Promise(r=>window.addEventListener("load",r)),
    waitForImages(),
    document.fonts ? document.fonts.ready : Promise.resolve()
  ]).then(()=>{

    loader.style.transition="opacity .6s ease";
    loader.style.opacity="0";

    setTimeout(()=>{
      loader.remove();
    },600);

  });

})();