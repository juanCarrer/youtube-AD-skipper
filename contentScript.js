console.log('cargando content script2')

const observer = new MutationObserver(handleMainParentElementChange);
const observerConfig = { attributes: true, childList: true, subtree: true }

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.type === 'changeUrl') {
      main()
      // console.log('modificando url', newUrl)
    }
    return true
  }
)


async function waitPageReady () {
  while (true) {
    console.log('validacion is complete')
    if (document.readyState === 'complete') {
      return true
    }
    await sleep(500)
  }
}

function handleMainParentElementChange (mutationList, observer) {
  const mainParentElement = mutationList[0].target
  clickSkipButton(mainParentElement)
}

async function main () {
  observer.disconnect()
  // validar si el observer esta funcionando para desconectarlot
  if (!window.location.pathname.includes('watch')) {
    // si la url no tiene watch
    // observer.disconnect();
    return
  }
  console.log('antes de esperar')
  await waitPageReady()
  console.log('despues de esperar')
  const mainParentElement = document.querySelector('#container div.video-ads')
  console.log('main parent element') 
  console.log(mainParentElement)
  // para la primera carga
  // clickSkipButton(mainParentElement) // FIXME: descomentar

  // detecta cambios posteriores
  observer.observe(mainParentElement, observerConfig)
}

function clickSkipButton (parentElement) {
  const buttonElement = parentElement.querySelector('button.ytp-ad-skip-button')
  if (buttonElement) {
    buttonElement.click()
    console.log('add skiped')
    return true
  }
  console.log('no hay add')
  return false
}

// espera una cantidad de milisegundos
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

main()

// primer acercamiento ( funciona pero tiene mal rendimiento) 
// setInterval(() => {
//   const skipAddButton = document.querySelector('button.ytp-ad-skip-button')
//   if (skipAddButton) {
//     console.log('**********click')
//     skipAddButton.click()
//   }
// }, 1000)


// elemento padre a escuchar = #container div.video-ads -> utilizar https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// query completa hasta el boton aun asi este oculto = #container div.video-ads  button.ytp-ad-skip-button

// al cargar es necesario detectar que en url estamos. si estamos en watch debemos proceder con el listener si no no
// otro aproach es escuchar el cambio de url para despues intentar recuperar el main container para hacer el proceso y si no no hacer nada
// evaluar dejar el dom content loaded como inicial y el otro en el caso de que se cambie de url

// const handleMainParentElementChange = (mutationList, observer) => {
//   console.log('mutation on parent')
//   debugger
// }
// const observer = new MutationObserver(handleMainParentElementChange);
// const observerConfig = { attributes: true, childList: true, subtree: true }

// document.addEventListener('DOMContentLoaded', () => {
//   console.log('dom cargado')
//   const mainParentElement = document.querySelector('#container div.video-ads')
//   console.log('main parent element') 
//   console.log(mainParentElement)


//   observer.observe(mainParentElement, observerConfig)


// });


document.addEventListener('DOMContentLoaded', (event) => {
  if (event.target === document.querySelector('html')) {
    console.log('dom cargado');
  }
});


document.addEventListener('DOMContentLoaded', (event) => {
  if (event.timeStamp > 1000) {
    console.log('dom cargado');
  }
});

window.addEventListener('locationChanged', (event) => {
  console.log('la url ha cambiado a:', event.location.href);
});