import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SidebarChevron = styled.i`
    margin-left: auto;
    transition: all .3s ease;
`

const SidebarMenu = styled.ul`
    margin: 36px 0;
    padding: 0 20px;
    transition: all .3s ease;

    & a {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #000;
        padding: 12px 16px 12px 0;
        transition: all .3s ease;
        border-radius: 10px;
        margin: 4px 0;
        white-space: nowrap;
    }

    &>li>a:hover {
	    background: #F1F0F6;
    }

    &>li>a.active ${SidebarChevron} {
	    transform: rotateZ(90deg);
    }

    &>li>a.active, 
    &>li>a.active:hover {
        background: #1775F1;
        color: #fff;
    }
`

export const SidebarDivider = styled.li`
    margin-top: 24px;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 700;
    color: #8D8D8D;
    transition: all .3s ease;
    white-space: nowrap;
`

const SidebarBrand = styled(Link)`
    color: #1775F1;
	font-size: 24px;
	font-weight: 700;
	display: flex;
	align-items: center;
    justify-content: space-between;
	height: 64px;
    padding: 0 57px;
    margin-top: 36px;
`

export const SidebarContainer = styled.div`
    max-width: 260px;
    width: 100%;
	overflow-y: auto;
	scrollbar-width: none;
	transition: all .3s ease;
    background: #fff;

    &.hide {
        max-width: 60px;
    }

    &.hide:hover {
        max-width: 260px;
    }

    &::-webkit-scrollbar {
        display: none;
    }

    &.hide ${SidebarMenu} {
        padding: 0 6px;
    }

    &.hide:hover ${SidebarMenu} {
	    padding: 0 20px;
    }

    &.hide ${SidebarDivider} {
        text-align: center;
    }

    &.hide:hover ${SidebarDivider} {
        text-align: left;
    }

    &.hide ${SidebarBrand} {
        padding: 0 59px;   
    }

    &.hide:hover ${SidebarBrand} {
        padding: 0 57px;   
    }
`

const SidebarIcon = styled.i`
    min-width: 48px;
    margin-right: 6px;
	display: flex;
	justify-content: center;
	align-items: center;
`

const SidebarDropdown = styled.ul`
    padding-left: 54px;
    max-height: 0;
    overflow-y: hidden;
    transition: all .15s ease;

    &.show {
        max-height: 1000px;
    }

    & a:hover {
	    color: #1775F1;
    }
`

const SidebarDropdownButton = styled.a``

const AdminSidebar = () => {
    const addShowAndHideDropdown = () => {
        $(`.${SidebarDropdownButton.styledComponentId}`).on('click', (event) => {
            event.preventDefault()
            const element = $(event.target)
            const siblingElement = element.next()

            if (siblingElement.hasClass('show')) {
                element.removeClass('active')
                siblingElement.removeClass('show')
            } else {
                element.addClass('active')
                siblingElement.addClass('show')
            }
        })
    }

    const addHoverEffectOnSidebar = () => {
        const sidebarContainer = $(`.${SidebarContainer.styledComponentId}`);

        sidebarContainer.mouseleave(() => {
            if (sidebarContainer.hasClass('hide')) {
                const sidebarDivider = $(`.${SidebarDivider.styledComponentId}`);
                sidebarDivider.text('-')
            }
        });

        sidebarContainer.mouseenter(() => {
            if (sidebarContainer.not('.hide')) {
                const sidebarDivider = $(`.${SidebarDivider.styledComponentId}`);
                sidebarDivider.text(sidebarDivider.data('text'))
            }
        })
    }

    useEffect(() => {
        addShowAndHideDropdown()
        addHoverEffectOnSidebar()
    }, [])

    return <SidebarContainer>
        <SidebarBrand to="/">
            <SidebarIcon className='bx bxs-smile' style={{ marginBottom: -4, marginRight: 0, minWidth: 'unset' }}></SidebarIcon> Registrar
        </SidebarBrand>

        <SidebarMenu>
            <li><Link to="/" className="active">
                <SidebarIcon className='bx bxs-dashboard' ></SidebarIcon> Dashboard</Link></li>
            <SidebarDivider data-text="main">Main</SidebarDivider>
            <li>
                <SidebarDropdownButton href="#">
                    <SidebarIcon className='bx bxs-inbox' ></SidebarIcon> Requests <SidebarChevron className='bx bx-chevron-right' >
                    </SidebarChevron></SidebarDropdownButton>
                <SidebarDropdown >
                    <li><Link to="/requests">All</Link></li>
                    <li><Link to="/requests/new">New</Link></li>
                </SidebarDropdown>
            </li>
        </SidebarMenu>
    </SidebarContainer>;
}

export default AdminSidebar;
