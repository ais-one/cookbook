export const layoutSecure = () => cy.get('[data-cy="layout-secure"]')

export const subMenu = (dataSubMenuId) => cy.get(`[data-submenu-id="${dataSubMenuId}"]`)

export const menu = (dataMenuId) => cy.get(`[data-menu-id="${dataMenuId}"]`)

export const buttonLogout = () => cy.get('[data-cy=logout]')
