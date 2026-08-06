window.ajtContentHandlers = Object.assign({
  dialog(element, handleRemoveContent, handleAddContent) {
    const dialog = document.createElement('dialog')
    dialog.className = 'dialog'
    dialog.closedBy = 'any'
    dialog.append(element)
    handleAddContent(dialog)
    return () => {
      document.body.append(dialog)
      dialog.showModal()
      dialog.addEventListener('close', (e) => {
        dialog.remove()
      })
    }
  },
  toast(element, handleRemoveContent, handleAddContent) {
    const toastElement = document.createElement('div')
    toastElement.className = 'toast hide'
    if (typeof element.dataset.appToastStyle === 'string') {
      toastElement.classList.add(...element.dataset.appToastStyle.split(/\s+/))
    }

    const toastBody = document.createElement('div')
    toastBody.className = 'toast-body'
    toastElement.appendChild(toastBody)

    const fragment = document.createDocumentFragment()
    while (element.firstChild) {
      handleAddContent(element.firstChild)
      fragment.appendChild(element.firstChild)
    }
    toastBody.appendChild(fragment)
    handleAddContent(toastElement)
    return () => {
      document.getElementById('toast-container').append(toastElement)
    }
  }
}, window.ajtContentHandlers)

document.addEventListener('ajtDomProcess', (event) => {
  const domProcess = event.detail

  domProcess.addEventListener('batch', (event) => {
    const batch = event.detail
    const clearViewTransitionNames = []
    batch.addEventListener('addElement', (event) => {
      const el = event.detail
      if (el.dataset?.appScrollIntoView) {
        batch.addEventListener('afterApplyDomChanges', () => {
          const p = el.scrollIntoView() || new Promise((resolve) => {
            setTimeout(resolve, 300)
          })
          batch.addTransitionPromise(p)
        })
      }
      if (el.dataset?.appViewTransitionName) {
        el.style.viewTransitionName = el.dataset.appViewTransitionName
        clearViewTransitionNames.push(el)
      }
      if (el.matches?.('.toast.hide')) {
        const toast = new bootstrap.Toast(el)
        batch.addEventListener('afterApplyDomChanges', () => {
          toast.show()
        })
      }
    })
    batch.addEventListener('afterUpdate', () => {
      clearViewTransitionNames.forEach(el => {
        el.style.viewTransitionName = null
      })
    })
  })
})