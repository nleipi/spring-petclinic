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
    })
    batch.addEventListener('afterUpdate', () => {
      clearViewTransitionNames.forEach(el => {
        el.style.viewTransitionName = null
      })
    })
  })
})