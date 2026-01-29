// Maaney Loader

(function(){

  // Create loader container
  const loader = document.createElement("div");
  loader.id = "maaney-loader";

  loader.innerHTML = `
    <img src="/logo.png" id="maaney-logo">
  `;

  document.body.appendChild(loader);

  // Loader styles
  const style = document.createElement("style");
  style.innerHTML = `
    #maaney-loader{
      position:fixed;
      inset:0;
      background:black;
      display:flex;
      justify-content:center;
      align-items:center;
      z-index:99999;
    }

    #maaney-logo{
      width:160px;
      animation: maaney 2s infinite ease-in-out;
    }

    @keyframes maaney{
      0%{
        transform:scale(.7);
        opacity:0;
      }
      50%{
        transform:scale(1.15);
        opacity:1;
      }
      100%{
        transform:scale(.7);
        opacity:0;
      }
    }
  `;

  document.head.appendChild(style);

  // Hide loader on load
  window.addEventListener("load",()=>{
    loader.style.transition="opacity .5s";
    loader.style.opacity=0;

    setTimeout(()=>{
      loader.remove();
    },500);
  });

})();
