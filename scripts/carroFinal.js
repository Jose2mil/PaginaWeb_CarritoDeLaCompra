//Jose Valera 1ºDAM

window.onload = function () 
{
    //Cambio color de fondo de carrito cada 1s
    let esDeColorRojo = true;
    let carritoCompra = this.document.getElementById("cart_items");
    
    carritoCompra.style.backgroundColor = "red";
    let cambioColor = setInterval(function()
    {
        if (! carritoCompra.hasChildNodes())
        {
            if(esDeColorRojo == true)
            {
                esDeColorRojo = false;
                carritoCompra.style.backgroundColor = "yellow";
            }

            else if(esDeColorRojo == false)
            {
                esDeColorRojo = true;
                carritoCompra.style.backgroundColor = "red";
            }
        }
    }, 1000);

    //Actualizar estructura y vista del carrito ante una interaccion del usuario
    function actualizarCarrito(opcion)
    {
        let carritoComp = document.getElementById("cart_items");
        let carritoEstilo = window.getComputedStyle(carritoComp,"");
        let totalProductos = carritoComp.childNodes.length;
        let anchoItem = 120;
        let scrollActual = +(carritoEstilo.left.replace("px", ""));
        let anchoActual = +(carritoEstilo.width.replace("px", ""));

        switch(opcion)
        {
            case 0: //Añadir Producto
                if(totalProductos > 4)
                {
                    carritoComp.style.width = (anchoActual + anchoItem) + "px";
                    carritoComp.style.left = (scrollActual - anchoItem) + "px";
                }
                break;
            case 1: //Eliminar Producto
                if(totalProductos >= 4)
                {
                    carritoComp.style.width = (anchoActual - anchoItem) + "px";
                    carritoComp.style.left = (scrollActual + anchoItem) + "px";
                }
                break;
            case 2: //Scroll Derecha
                if(totalProductos > 4)
                {
                    carritoComp.style.left = (scrollActual - 50) + "px";
                }
                break;
            case 3: //Scroll Izquierda
                if(totalProductos > 4)
                {
                    carritoComp.style.left = (scrollActual + 50) + "px";
                }
                break;
        }

        //Comprobaciones para los extremos del carrito
        let minScroll = 0;
        let maxScroll = -anchoItem * (totalProductos - 4);

        if(totalProductos == 4)
        carritoComp.style.left = minScroll + "px"; 

        else if (totalProductos > 4)
        {
            carritoEstilo = window.getComputedStyle(carritoComp,"");
            scrollActual = +(carritoEstilo.left.replace("px", ""));
            
            if(scrollActual > minScroll)
                carritoComp.style.left = minScroll + "px"; 
            else if(scrollActual < maxScroll)
                carritoComp.style.left = maxScroll + "px"; 
        }
    }

    //Eliminar producto del carrito y sus consecuancias
    let eliminarCarrito = function()
    {
        event.preventDefault();
        let articuloC = this.parentNode;
        let articuloL = document.getElementById(articuloC.id.replace('c', ''));

        let lStock = articuloL.querySelector(".stock");
        let lStockVal = lStock.textContent;
        lStockVal = +(lStockVal.replace("Stock ", ""));

        if(lStockVal == 0)
        lStock.classList.remove("agotado");

        lStockVal++;
        let lStockNuevo = document.createTextNode("Stock " + lStockVal);
        lStock.removeChild(lStock.firstChild);
        lStock.appendChild(lStockNuevo);

        let cPrice = document.getElementById("cprice");
        let articuloPrecio = +(articuloL.getElementsByClassName("price")[0].textContent.replace("€", ""));
        let cPriceNuevo = (+(cPrice.value.replace("€", "")) - articuloPrecio) + "€";
        cPrice.value = cPriceNuevo;

        let cItem = document.getElementById("citem");
            cItem.value = +(cItem.value) - 1;
        
        articuloC.parentNode.removeChild(articuloC);

        actualizarCarrito(1);
    }

    //Interactuación con usuario al pulsar boton de vaciar
    let vaciarCarrito = function()
    {
       let deletes = document.querySelectorAll("#cart_container .delete");

       for(let i = 0; i < deletes.length; i ++)
       {
           deletes[i].click();
       }
    }

    //Añadir producto al carrito y sus consecuancias
    let anadirCarrito = function()
    {
        let posicion = this.querySelector(".stock");
        let stockAntes = posicion.textContent;
        stockAntes = stockAntes.replace("Stock ", "");

        if(stockAntes != 0)
        {
            let articulo = document.getElementById(this.id).cloneNode(true);
            articulo.setAttribute("id", "c" + this.id);

            articulo.style.cursor = "default";
            
            let enlace = document.createElement("a");
            enlace.setAttribute("class", "delete");
            enlace.addEventListener('click', eliminarCarrito);
            articulo.insertBefore(enlace, articulo.firstChild);

            articulo.querySelector(".stock").style.display = 'none';
            
            let carrito = document.getElementById("cart_items");
            carrito.appendChild(articulo);

            let nuevoStock = parseInt(stockAntes) - 1;

            if(nuevoStock == 0)
            posicion.classList.add("agotado");

            let cItem = document.getElementById("citem");
            cItem.value = +(cItem.value) + 1;
            
            let cPrice = document.getElementById("cprice");
            let articuloPrecio = +(articulo.getElementsByClassName("price")[0].textContent.replace("€", ""));
            let cPriceNuevo = +(cPrice.value.replace("€", "")) + articuloPrecio + "€";
            cPrice.value = cPriceNuevo;

            let stockAhora = document.createTextNode("Stock " + nuevoStock);
            posicion.removeChild(posicion.firstChild);
            posicion.appendChild(stockAhora);

            actualizarCarrito(0);
        }
    }

    //Aplicamos a los elementos correspondientes sus eventos necesarios
    let articulos = document.getElementsByClassName("item");

    for(let i = 0; i < articulos.length; i ++)
    {
        articulos[i].addEventListener('dblclick', anadirCarrito);
    }

    let botonVaciar = document.getElementById("btn_clear");
    botonVaciar.addEventListener('click', vaciarCarrito);

    let moverScrollIzquierda = function(){actualizarCarrito(3);}
    let scrollIzquierda = document.getElementById("btn_prev");
    scrollIzquierda.addEventListener('click', moverScrollIzquierda);

    let moverScrollDerecha = function(){actualizarCarrito(2);}
    let scrollDerecha = document.getElementById("btn_next");
    scrollDerecha.addEventListener('click', moverScrollDerecha);
}