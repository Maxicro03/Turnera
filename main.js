let agregar = document.getElementById("plus")
let contenedor = document.getElementById("agregar")
let nombres = document.getElementsByClassName("jugador")
let enviar = document.getElementById("enviar")
let principal = document.getElementsByClassName("principal")
let jugadores = document.getElementById("jugadores")
let cards = document.getElementById("tarjetas")
let posicionNumero = document.getElementsByClassName("numeroPosicion")
let frente = document.getElementsByClassName("frente")
let numeroSeleccionado = document.getElementsByClassName("numero")
let nombreSeleccion = document.getElementById("nombreSeleccion")
let cantidadCarrito = document.getElementById("conArticulos")
let contenedorProducto = document.getElementById("contenedorProductos")
let setTurnos = document.getElementById("turnosJugar")
let contenedorNuevoTurno = document.getElementById("contenedorEleccion")
let btnTirarNuevo = document.getElementById("btnNuevo")
let contenedorJuegoNuevo = document.getElementById("jugarDeNuevo")
let btnReclamar = document.getElementById("btnRecompensa")
let cuentaAtras = document.getElementById("contenedorRecompensa")
const hoy= new Date().getTime()
const milisegundosDia = (24 * 60 * 60 * 1000)
let mañana = hoy + milisegundosDia
let participante = []
let sorteo = []
let numeros = []
let corresponde = []
let productos = []
let precioTurnos = 1
let valorTotalProductos = 0    

class Participantes{
    constructor(nombre, id){
        this.nombre = nombre,
        this.id = id
    }
}

class Compra{
    constructor(cantidad, precio, multiplicador){
        this.cantidad = cantidad,
        this.precio = precio
        this.multiplicador = multiplicador
    }
  }


function mas(){//al activarse esta funcion lo primero q se hace es verificar que no haya inputs vacios y despues en el caso de que esten completos, dandole al mas se puede agregar un input mas 
    agregar.onclick = () => {
        let nombresNoVacios = Array.from(nombres).filter((input) => input.value.trim() !== "");
        if(nombresNoVacios.length === nombres.length){
            let jugador = document.createElement("input")
            jugador.setAttribute("type", "text")
            jugador.classList.add("jugador")
            contenedor.insertBefore(jugador, agregar)
            if(contenedor.childElementCount > 24){
                agregar.style.display = "none"
            }
        }
        else{
            console.log("existen casillas vacias")
        }
        //console.log(contenedor.childElementCount)
}
}
mas()

function lista(){ //al clickear enviar se hacen invisibles todas las casillas y por detras se crean una lista donde se agregan todos los nombres y luego se sortean, tambien se chequea que no se repitan nombres y si hay inputs vacios no se agregan al sorteo
    enviar.onclick = () =>{
        if(localStorage.getItem("turnosAJugar") > 0){
            for(let i = 0; i < contenedor.childElementCount; i++){
                let participanteNombres = participante.map(p => p.nombre)
                if(participanteNombres.includes(contenedor.children[i].value)){
                    //console.log(`El nombre de ${contenedor.children[i].value} se repite, por favor cambielo o eliminelo`)
                    swal({
                        title: `Nombres repetidos`,
                        text: `Por favor cambie uno de los nombres para continuar`,
                        icon: `warning`,
                        button: `Ok`,
                    })
                    contenedor.children[i].classList.add("repetido")
                    let encontrar = participanteNombres.indexOf(contenedor.children[i].value)
                    contenedor.children[encontrar].classList.add("principal")
                    participante = []
                    return
                }
                else{
                    if(contenedor.children[i].value === ""){
                        contenedor.children[i].classList.remove("repetido")
                        contenedor.children[i].classList.remove("principal")
                    }
                    else{
                        let enviarDatos = new Participantes(contenedor.children[i].value, i + 1)
                        participante.push(enviarDatos)
                        //console.log("se agrego el nombre " + contenedor.children[i].value)
                        contenedor.children[i].classList.remove("repetido")
                        contenedor.children[i].classList.remove("principal")
                    }
                }
            }
            //console.log(participante.length)
            if(participante.length  <= 1){
                participante = []
                //console.log(`No se puede realizar un sorteo de 1 persona, por favor ingrese otro participante`)
                swal({
                    title: `Participantes insuficientes`,
                    text: `Por favor ingrese mínimo 2 participantes`,
                    icon: `error`,
                    button: `Ok`,
                })
            }
            else{
                jugadores.classList.add("invisible")
                cards.classList.remove("invisible")
                contenedorEleccion.classList.remove("invisible")
                //console.log(participante)
                while(0 < participante.length){
                    let seleccion = Math.floor(Math.random()* participante.length)
                    //console.log(seleccion)
                    //console.log(participante[seleccion])
                    sorteo.push(participante[seleccion])
                    participante.splice(seleccion, 1)
                    //console.log(sorteo)
                }
                //console.log(sorteo.length)
                //se crean las tarjetas por la cantidad de nombres ingresados
                let contenedorPrincipal = document.getElementById("contenedorPrincipal")
                let contenedorTurnos = document.getElementById("contenedorTurnos")
                if(sorteo.length > 6 && sorteo.length <= 12){
                    contenedorPrincipal.style.gridTemplateRows = "repeat(4, 300px)"
                    cards.style.gridRow = "2 / 4"
                    contenedorTurnos.style.gridRow = "4"
                }
                else if(sorteo.length > 12 && sorteo.length <= 18){
                    contenedorPrincipal.style.gridTemplateRows = "repeat(5, 300px)"
                    cards.style.gridRow = "2 / 5"
                    contenedorTurnos.style.gridRow = "5"
                }
                else if(sorteo.length > 18 && sorteo.length <= 24){
                    contenedorPrincipal.style.gridTemplateRows = "repeat(6, 300px)"
                    cards.style.gridRow = "2 / 6"
                    contenedorTurnos.style.gridRow = "6"
                }
                for(let i = 0; i < sorteo.length ; i++){
                    cards.innerHTML +=  `<div class="seleccionable" id="${i}">
                                            <div class="frente volteado">
                                                <div class="numero">
                                                    <p class="numeroPosicion" id="numero${i}"></p>
                                                </div>
                                                <div class="nombre" >
                                                    <p class="nombreEleccion"  id="nombre${i}"></p>
                                                </div>
                                            </div>
                                            <div class="reverso">
                                                <p class="numeroTarjeta">${i + 1}</p>
                                            </div>
                                        </div>`
                }
                //se crean los numeros x la cantidad de nombres ingresados
                for(let i = 0; i < sorteo.length; i++){
                    numeros.push(i + 1)
                }
            voltear()
            }
            let obtenerTurnos = localStorage.getItem("turnosAJugar")
            let turnosComprados = parseInt(obtenerTurnos)
            localStorage.setItem("turnosAJugar", turnosComprados - 1)
            setTurnos.innerText = localStorage.getItem("turnosAJugar")

            function voltear(){
                let tarjetas = document.querySelectorAll(".seleccionable")
                tarjetas.forEach(function (tarjeta) { //por cada objeto que contenga la clase seleccionable se chequea cual es su id
                    nombreSeleccion.innerText = `${sorteo[0].nombre}`
                    //console.log(`esto es lo q te muestro, nombre: ${sorteo[0].nombre}`)
                    tarjeta.addEventListener("click", function (evento) {
                    const divClickeado = evento.currentTarget
                    const idSeleccion = divClickeado.id
                    let cambiar = document.getElementById(idSeleccion)
                    if(Array.from(cambiar.children[1].classList).includes("volteado")){//buscamos que el contenedor 2 que ocupa la posicion 1 que tenga la clase volteado
            
                    }
                    else{
                        //en el caso de no tener la clase volteado se ejecuta todo el codigo para dar vuelta la tarjeta, asignarle el nombre correspondiente y un numero al azar
                        cambiar.children[1].classList.add("volteado")
                        let mostrar = document.getElementById(`nombre${idSeleccion}`)
                        let mostrarNumero = document.getElementById(`numero${idSeleccion}`)
                        mostrar.innerText= `${sorteo[0].nombre}`
                        //console.log(sorteo[0])
                        sorteo.splice(0, 1)
                        nombreSeleccion.innerText = (sorteo[0]?.nombre || "-")
                        //console.log(numeros)
                        let seleccionNumero = Math.floor(Math.random()* numeros.length)
                        mostrarNumero.innerText= `${numeros[seleccionNumero]}`
                        numeros.splice(seleccionNumero, 1)
                        cambiar.children[0].classList.remove("volteado")
                        cambiar.classList.add("vuelta")
                        let contenedorFrente = cambiar.children[0]
                        let contenedorNumero = contenedorFrente.children[0]
                        if(contenedorNumero.children[0].innerText == 1){
                            cambiar.classList.add("primero")
                        }
                        else if(contenedorNumero.children[0].innerText == 2){
                            cambiar.classList.add("segundo")
                        }
                        else if(contenedorNumero.children[0].innerText == 3){
                            cambiar.classList.add("tercero")
                        }
                       if(numeros.length <= 0){
                        nombreSeleccion.classList.add("invisible")
                        contenedorJuegoNuevo.classList.remove("invisible")
                        jugarNuevamente()       
                       }
                    }
                  });
                });
                //if(sorteo.length < 0){
                //    nombreSeleccion.classList.add("invisible")//falta arreglar
               // }
            }
            
            }
            else{
                swal({
                    title: `Turnos insuficientes`,
                    text: `No cuentas con turnos, reclama el turno diario o puedes comprar turnos`,
                    icon: `error`,
                    button: `Ok`,
                })
            }
        }
}
lista()

function jugarNuevamente(){
    btnTirarNuevo.onclick = () => {
        participante = []
        sorteo = []
        numeros = []
        cards.innerHTML = ``
        contenedorJuegoNuevo.classList.add("invisible")
        cards.classList.add("invisible")
        contenedorEleccion.classList.add("invisible")
        jugadores.classList.remove("invisible")
        nombreSeleccion.classList.remove("invisible")
        //console.log(contenedor.childElementCount)
        for(let i = contenedor.childElementCount - 2; i >= 0; i--){
            //console.log(contenedor.children[i])
            if(i < 2){
                for(let i = 0; i < 2; i++)
                contenedor.children[i].value = ``
            }
            else{
                contenedor.children[i].remove("input")
            }
        }
        agregar.style.display = "block"
        lista()
    }
}


//esta variable hace funcionar la compra personalizada que es el div que el numero de turnos esta vacio y te permite llenarlos
function compraPersonalizada(){
    let cantidadPersonalizada = document.getElementById("turnosEleccion");
    let precioPersonalizado = document.getElementById("precioPersonalizado")
    cantidadPersonalizada.addEventListener("input", function(event) {
      let valorActual = event.target.value;
      let maxCaracteres = parseInt(cantidadPersonalizada.getAttribute("maxlength"))
      if(valorActual.length > maxCaracteres){
        cantidadPersonalizada.value = valorActual.slice(0, maxCaracteres)
      }
      else{
        precioPersonalizado.innerText = `USD ${valorActual * precioTurnos}`
        } 
    })
}

compraPersonalizada()

//cuando se clickea el boton añadir al carrito se envian todos los datos correspondientes de ese producto al localStorage
//identificando que producto es cada uno para no enviar informacion erronea

function enviarCarrito(){
    
        let enviarAlCarrito = document.querySelectorAll(".agregarCarrito")
        enviarAlCarrito.forEach(function (elemento) {
            elemento.addEventListener("click", function (evento) {
              let divClickeado = evento.currentTarget
              let idSeleccion = divClickeado.id
              let ordenCompra = document.getElementById(`${idSeleccion}`)
              let enviarCompra = new Compra((ordenCompra.children[0].textContent || ordenCompra.children[0].value), precioTurnos, 1)
              let conversionJSON = JSON.stringify(enviarCompra)
              if (idSeleccion === "perso") {
                let cantidadPersonalizada = ordenCompra.children[0].value;
                if (cantidadPersonalizada !== "") {
                    let conversionPerso = JSON.parse(localStorage.getItem("productoperso"))
                    if (conversionPerso !== null) {
                        if(conversionPerso.cantidad !== ordenCompra.children[0].value){
                            conversionPerso.cantidad = cantidadPersonalizada
                            conversionPerso.multiplicador = 1
                            localStorage.setItem("productoperso", JSON.stringify(conversionPerso))
                        }
                        else{
                            conversionPerso.multiplicador += 1
                            localStorage.setItem("productoperso", JSON.stringify(conversionPerso))
                        }
                        
                    } 
                    else {
                        let enviarCompraPerso = new Compra(cantidadPersonalizada, precioTurnos, 1)
                        localStorage.setItem("productoperso", JSON.stringify(enviarCompraPerso))
                        if (cantidadCarrito.children[0].innerText === "0") {
                            cantidadCarrito.style.display = "block"
                        }
                        let cantidadProductos = localStorage.length - 4
                        cantidadCarrito.children[0].innerText = cantidadProductos
                        localStorage.setItem("objetosCarrito", cantidadProductos)
                    }
                }
              }
              else {
                let convertirObjeto = JSON.parse(localStorage.getItem(`producto${idSeleccion}`))
                if (convertirObjeto) {
                    convertirObjeto.multiplicador += 1
                    let compraRepetida = JSON.stringify(convertirObjeto)
                    localStorage.setItem(`producto${idSeleccion}`, compraRepetida)
                }
                else {
                    localStorage.setItem(`producto${idSeleccion}`, conversionJSON)
                    if (cantidadCarrito.children[0].innerText === "0") {
                        cantidadCarrito.style.display = "block"
                    }
                    let cantidadProductos = localStorage.length - 4
                    cantidadCarrito.children[0].innerText = cantidadProductos
                    localStorage.setItem("objetosCarrito", cantidadProductos)
                }
            }
        });
    });
}

enviarCarrito()

//al momento de darle click al carrito todos los valores que anteriormente fueron guardados en el localStorage se cargan en una ventana emergetne creando un div para cada uno
//y dando los datos necesarios para cada parte

function finalizarCompra(){
    let finalizar = document.getElementById("finalizarCompra")
    finalizar.onclick = () => {
            if(localStorage.getItem("objetosCarrito") > 0){
            let terminarCompra = document.getElementById("ventanaFinalizarCompra")
            terminarCompra.style.display = "block"
            if(localStorage.getItem("productoperso")){
                let modificarProducto = JSON.parse(localStorage.getItem("productoperso"))
                localStorage.removeItem("productoperso")
                localStorage.setItem(`producto0${modificarProducto.cantidad}`, JSON.stringify(modificarProducto)) 
            }
            for(let i = 0; i < localStorage.length; i++){
                let evaluarProducto = localStorage.key(i)
                let conversionProducto = JSON.parse(localStorage.getItem(evaluarProducto))
                if(evaluarProducto.includes("producto")){                                       
                    productos.push(conversionProducto)
                }
            }                    
            productos.sort((a, b) =>a.cantidad - b.cantidad)// Ordenar de mayor a menor según el valor de 'cantidad                                             
            for (let i = 0; i < productos.length; i++) {
                contenedorProducto.innerHTML += `<div class="contenedorPU" id="${productos[i].cantidad}">
                                                    <div class="cantidadDeProducto">
                                                        <p class = "eliminarProducto" id="eliminarProducto${productos[i].cantidad}"><i class="fa-solid fa-trash"></i></p>
                                                    </div>
                                                    <div class="cantidadDeProducto">
                                                        <p class = "cantidadTexto" id="textoCantidad${productos[i].cantidad}">${productos[i].cantidad}</p>
                                                    </div>
                                                    <div class="multiplicador">
                                                        <button class = "sumarMultiplicador" id = "sumar${productos[i].cantidad}"><i class="fa-solid fa-plus"></i></button>
                                                        <p>x${productos[i].multiplicador}</p>
                                                        <button class = "restarMultiplicador" id = "restar${productos[i].cantidad}"><i class="fa-solid fa-minus"></i></i></button>
                                                    </div>
                                                    <div class="contenedorUSD">
                                                        <p>USD ${productos[i].precio * (productos[i].cantidad * productos[i].multiplicador)}</p>
                                                    </div>
                                                </div>`
                valorTotalProductos += productos[i].precio * (productos[i].cantidad * productos[i].multiplicador)
                if(productos.length - 1 === i ){
                    contenedorProducto.innerHTML += `<div class = "contenedorMayorPagar">
                                                        <div class = "pagarTotal" id = "totalAPagar">
                                                            <p class = "textoTotal">Total:</p>
                                                            <p class = "cantidadTotalUSD" id = "cantidadUSD">USD ${valorTotalProductos}</p>
                                                        </div>
                                                        <div class = "contenedorPagar">
                                                            <button class = "pagarProductos" id = "pagar">Pagar</button>
                                                        </div>
                                                    </div>`
                }
            }
            sumarMultiplicador()
            restarMultiplicador()
            pagarTotal()
            eliminarProductoCarrito()
            valorTotalProductos = 0
        }
        else{
            swal({
                title: `Carrito vacío`,
                text: `No cuentas con ningún producto en el carrito`,
                icon: `error`,
                button: `Ok`,
            })
        }                         
    }
}

finalizarCompra()

//en esta funcion se evaluan los valores de los multiplicadores y al darle al boton de + se aumenta el multiplicador modificando tambien el valor del localStorage
//para que al momento de pagar se puedan hacer bien las cuentas de cuantos turnos le corresponden al usuario y cual es el valor a pagar
function sumarMultiplicador(){
    let sumarProducto = document.querySelectorAll(".sumarMultiplicador")
    sumarProducto.forEach(function (elemento) {
        elemento.addEventListener("click", function (evento) {
          let divClickeado = evento.currentTarget;
          let idSeleccion = divClickeado.id;
          let idSumar = document.getElementById(`${idSeleccion}`)
          let accesoPadre = idSumar.parentNode
          let textoModificar = accesoPadre.children[1].innerText
          let retirarX = textoModificar.replace("x", "")
          let numeroASumar = parseInt(retirarX)
          let accesoContenedor = accesoPadre.parentNode
          let accesoValor = accesoContenedor.children[3]
          let accesoContenedorCantidad = accesoContenedor.children[1]
          if (numeroASumar <= 9) {
            let conversionProducto = JSON.parse(localStorage.getItem(`producto0${accesoContenedorCantidad.innerText}`))
            conversionProducto.multiplicador += 1
            let subirNuevoMultiplicador = JSON.stringify(conversionProducto)
            localStorage.setItem(`producto0${accesoContenedorCantidad.innerText}`, subirNuevoMultiplicador)
            let modificarId = idSeleccion.replace("sumar", "")
            let buscarPosicion = productos.find((producto) => producto.cantidad === modificarId)
            buscarPosicion.multiplicador +=1
            accesoValor.children[0].innerText =`USD ${ (numeroASumar + 1) * accesoContenedor.children[1].innerText}`
            accesoPadre.children[1].innerText =`x${ numeroASumar + 1}`
            let sumarProducto = document.querySelectorAll(".contenedorUSD")
            sumarProducto.forEach(function (elemento) {
                let valorAModificar = elemento.children[0].innerText
                let retirarUSD = valorAModificar.replace("USD", "")
                valorTotalProductos += parseInt(retirarUSD)
            })
            let nuevoTotal = document.getElementById("cantidadUSD")
            nuevoTotal.innerText = `USD ${valorTotalProductos}`
          }
          valorTotalProductos = 0
        })
    })
}

//lo que se hace en esta funcion es lo mismo que en la de arriba pero restando los numeros de los multiplicadores

function restarMultiplicador(){
    let sumarProducto = document.querySelectorAll(".restarMultiplicador")
    sumarProducto.forEach(function (elemento) {
        elemento.addEventListener("click", function (evento) {
          let divClickeado = evento.currentTarget;
          let idSeleccion = divClickeado.id;
          let idSumar = document.getElementById(`${idSeleccion}`)
          let accesoPadre = idSumar.parentNode
          let textoModificar = accesoPadre.children[1].innerText
          let retirarX = textoModificar.replace("x", "")
          let numeroARestar = parseInt(retirarX)
          let accesoContenedor = accesoPadre.parentNode
          let accesoValor = accesoContenedor.children[3]
          let accesoContenedorCantidad = accesoContenedor.children[1]
          if(numeroARestar >= 2){
            let conversionProducto = JSON.parse(localStorage.getItem(`producto0${accesoContenedorCantidad.innerText}`))
            conversionProducto.multiplicador -= 1
            let subirNuevoMultiplicador = JSON.stringify(conversionProducto)
            localStorage.setItem(`producto0${accesoContenedorCantidad.innerText}`, subirNuevoMultiplicador)
            let modificarId = idSeleccion.replace("restar", "")
            let buscarPosicion = productos.find((producto) => producto.cantidad === modificarId)
            buscarPosicion.multiplicador -=1
            accesoValor.children[0].innerText =`USD ${ (numeroARestar - 1) * accesoContenedor.children[1].innerText}`
            accesoPadre.children[1].innerText =`x${ numeroARestar - 1}`
            let restarProducto = document.querySelectorAll(".contenedorUSD")
            restarProducto.forEach(function (elemento) {
                let valorAModificar = elemento.children[0].innerText
                let retirarUSD = valorAModificar.replace("USD", "")
                valorTotalProductos += parseInt(retirarUSD)
            })
            let nuevoTotal = document.getElementById("cantidadUSD")
            nuevoTotal.innerText = `USD ${valorTotalProductos}`
          }
          valorTotalProductos = 0
        })
    })
}

function eliminarProductoCarrito(){
    let btnEliminar = document.querySelectorAll(".eliminarProducto")
    btnEliminar.forEach(function (elemento) {
        elemento.addEventListener("click", function (evento) {
          let divClickeado = evento.currentTarget;
          let idSeleccion = divClickeado.id;
          let eliminarTexto = idSeleccion.replace("eliminarProducto", "")
          localStorage.removeItem(`producto0${eliminarTexto}`)
          let restarCarrito = localStorage.getItem("objetosCarrito")
          localStorage.setItem("objetosCarrito", restarCarrito - 1)
          cantidadCarrito.children[0].innerText = localStorage.getItem("objetosCarrito")
          //console.log(productos)
          if(localStorage.getItem("objetosCarrito") <= 0){
            cantidadCarrito.style.display = "none"
          }
          let buscarPosicion = productos.find((producto) => producto.cantidad === eliminarTexto)
          let reconocerPosicion =  productos.indexOf(buscarPosicion)
          productos.splice(reconocerPosicion, 1)
          //console.log(productos)
          let borrarContenedor = document.getElementById(`${eliminarTexto}`)
          borrarContenedor.remove("div")
          let actualizarTotal = document.querySelectorAll(".contenedorUSD")
            actualizarTotal.forEach(function (elemento) {
                let valorAModificar = elemento.children[0].innerText
                let retirarUSD = valorAModificar.replace("USD", "")
                valorTotalProductos += parseInt(retirarUSD)
            })
            let nuevoTotal = document.getElementById("cantidadUSD")
            nuevoTotal.innerText = `USD ${valorTotalProductos}`
          if(contenedorProducto.childElementCount <= 2){
            cerrarVentanaPagar()
          }
          valorTotalProductos = 0
        })
    })

}

//en la funcion pagar total lo que se hace es sumar todos los turnos que hay haciendo la multiplicacion dependiendo el multiplicador que tenga
//e ir eliminando los valores del localStorage y reduciendo el numero del carrito cuando esto suceda

function pagarTotal(){
    let pagar = document.getElementById("pagar")
    let cantidadTurnos = 0
    pagar.onclick = () =>{
        for(let i = 0;i < productos.length ; i++){
            cantidadTurnos += parseInt(productos[i].cantidad) * parseInt(productos[i].multiplicador)
        } 
        let sumarAlTotal = parseInt(setTurnos.innerText)
        setTurnos.innerText = sumarAlTotal + cantidadTurnos
        if(localStorage.getItem("turnosAJugar")){
          let obtenerDatos = localStorage.getItem("turnosAJugar")
          let nuevosTurnos = parseInt(obtenerDatos) + cantidadTurnos
          localStorage.setItem("turnosAJugar",nuevosTurnos)
        }
        else{
            localStorage.setItem("turnosAJugar",cantidadTurnos)
        }
        cantidadTurnos = 0
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.includes("producto")) {
              localStorage.removeItem(key);
              let obtenerCarrito = localStorage.getItem("objetosCarrito")
              let valorCarrito = parseInt(obtenerCarrito)
              localStorage.setItem("objetosCarrito", valorCarrito - 1)
            }
        }
        cantidadCarrito.children[0].innerText = localStorage.getItem("objetosCarrito")
        if(cantidadCarrito.children[0].innerText == 0){
            cantidadCarrito.style.display = "none"
        }
        cerrarVentanaPagar()
    }
}

//funcion para cerrar la ventana emergente que se abre al momento de pagar
function cerrarVentanaPagar() {
    let terminarCompra = document.getElementById("ventanaFinalizarCompra");
    terminarCompra.style.display = "none";
    contenedorProducto.innerHTML = `<div class="botonCerrar">
                                            <button onclick="cerrarVentanaPagar()" class = "cerrar"><i class="fa-solid fa-xmark cerrar"></i></button>
                                    </div>`
    productos = []
  }

function recompensaDiaria() {
    let fechaObjetivo = localStorage.getItem("recompensaDiaria")
    const hoyFuncion = new Date().getTime()
    //console.log(hoyFuncion)
    const tiempoRestante = fechaObjetivo - hoyFuncion
    //console.log(tiempoRestante)
    if(tiempoRestante <= 0){
        localStorage.setItem("tiempoCumplido", "true")
        cuentaAtras.classList.add("invisible")
        btnReclamar.classList.remove("invisible")
    }
    else{
        let horas = Math.floor(tiempoRestante / 1000 / 60 / 60)
        let minutos = Math.floor(tiempoRestante % (1000 * 60 * 60) / (1000 * 60))
        let segundos = Math.round(tiempoRestante % (1000 * 60) / 1000)
        //console.log(`${horas}:${minutos}:${segundos}`)
        const agregarCeroHoras = String(horas).padStart(2, '0')
        const agregarCeroMinutos = String(minutos).padStart(2, '0')
        const agregarCeroSegundos = String(segundos).padStart(2, '0')
        let textoRecompensa = document.getElementById("recompensaDiaria")
        textoRecompensa.innerText = `${agregarCeroHoras}:${agregarCeroMinutos}:${agregarCeroSegundos}`
    
        setTimeout(recompensaDiaria, 1000)
    }
}
recompensaDiaria()

function afterRecompensa(){
    btnReclamar.onclick = () =>{
        if(localStorage.getItem("tiempoCumplido") == "true"){
            let sumarTurnos = parseInt(localStorage.getItem("turnosAJugar")) + 1
            localStorage.setItem("turnosAJugar", sumarTurnos)
            setTurnos.innerText = `${localStorage.getItem("turnosAJugar")}`
        }
        const hoyRecargar = new Date().getTime()
        const milisegundosDiaRecargar = (24 * 60 * 60 * 1000)
        let mañanaRecargar = hoyRecargar + milisegundosDiaRecargar
        localStorage.setItem("tiempoCumplido", "false")
        localStorage.setItem("recompensaDiaria", mañanaRecargar)
        recompensaDiaria()
        cuentaAtras.classList.remove("invisible")
        btnReclamar.classList.add("invisible")
    }
}

afterRecompensa()

//apenas se carga la pagina lo primero que se hace es revisar si algunos valores estan cargados en el local storage y en caso contrario crearlos
document.addEventListener("DOMContentLoaded", function () {
    if(localStorage.getItem("turnosAJugar")){
        setTurnos.innerText = localStorage.getItem("turnosAJugar")
    }
    else{
        localStorage.setItem("turnosAJugar", 5)
        setTurnos.innerText = localStorage.getItem("turnosAJugar")
    }
    localStorage.setItem("objetosCarrito", (localStorage.length - 4))
    if(localStorage.getItem("objetosCarrito") > 0){
        cantidadCarrito.children[0].innerText = localStorage.getItem("objetosCarrito")
        cantidadCarrito.style.display = "block"
    }
    if(localStorage.getItem("recompensaDiaria")){
        if(localStorage.getItem("tiempoCumplido") == "true"){
            cuentaAtras.classList.add("invisible")
            btnReclamar.classList.remove("invisible")
        }
    }
    else{
        localStorage.setItem("recompensaDiaria", mañana)
        localStorage.setItem("tiempoCumplido", "false")
    }
})
