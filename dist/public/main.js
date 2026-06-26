'use strict'

function findButton(re) {
    const nodes = [
        ...document.querySelectorAll('button'),
        ...document.querySelectorAll('[role="button"]')
    ]

    return nodes.find(el =>
        re.test(
            (el.textContent || '').trim()
        )
    )
}

function clickYes() {
    const yes = findButton(/^(yes|确定|确认)$/i)
    if (!yes) return false
    yes.click()
    return true
}

function clickNo() {
    const no = findButton(/^(no|取消|cancel)$/i)
    if (!no) return false
    no.click()
    return true
}

function clickContinue() {
    const btn = findButton(/^(continue|继续)$/i)
    if (!btn) return false
    btn.click()
    return true
}

function isFormInputFocused() {
    const el = document.activeElement
    if (!el) return false
    
    const tagName = el.tagName.toLowerCase()
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        if (tagName === 'input') {
            const type = (el.type || '').toLowerCase()
            if (type === 'checkbox' || type === 'radio' || 
                type === 'button' || type === 'submit' || 
                type === 'reset' || type === 'image') {
                return false
            }
        }
        return true
    }
    
    if (el.isContentEditable) return true
    
    return false
}

// 判断是否为 Login 对话框
function isLoginDialog() {
    const dialog = document.querySelector('[role="dialog"]')
    if (!dialog) return false
    return !!dialog.querySelector('.fa-user')
}

// 判断是否为 Search 对话框
function isSearchDialog() {
    const dialog = document.querySelector('[role="dialog"]')
    if (!dialog) return false
    return dialog.id === 'search-dialog'
}

// 判断是否应该跳过（Login 或 Search 对话框）
function shouldSkipDialog() {
    return isLoginDialog() || isSearchDialog()
}

document.addEventListener('keydown', e => {
    // Login 和 Search 对话框直接跳过
    if (shouldSkipDialog()) return

    if (e.key === 'Enter') {
        if (isFormInputFocused()) {
            const continueBtn = findButton(/^(continue|继续)$/i)
            const yesBtn = findButton(/^(yes|确定|确认)$/i)
            
            if (continueBtn) {
                continueBtn.click()
            } else if (yesBtn) {
                yesBtn.click()
            }
            
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            return false
        }
        
        if (clickContinue() || clickYes()) {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            return false
        }
    }

    if (e.key === 'Escape') {
        if (clickNo()) {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            return false
        }
    }

    if (e.key === 'Backspace') {
        if (!isFormInputFocused() && clickNo()) {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            return false
        }
    }

}, true)

document.addEventListener('submit', e => {
    if (shouldSkipDialog()) return
    
    const continueBtn = findButton(/^(continue|继续)$/i)
    const yesBtn = findButton(/^(yes|确定|确认)$/i)
    
    if (continueBtn || yesBtn) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        
        if (continueBtn) {
            continueBtn.click()
        } else if (yesBtn) {
            yesBtn.click()
        }
        return false
    }
}, true)