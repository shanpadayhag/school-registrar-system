import React, { useEffect, useState } from "react";
import styled from "styled-components";

const DropdownInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 14px;
    transition: all 2s ease;
    position: relative;
    padding: 20px;
    background: #ffffff;
    border-radius: 10px;

    ul.selector-options {
        position: absolute;
        top: 100%;
        margin-top: -10px;
        width: calc(100% - 40px);
        display: block;
        z-index: 2;
        opacity: 1;
        border-radius: 10px;
        color: white;

        &.hide {
        opacity: 0;
        }
            
        &:after {
            position: absolute;
            top: -7px;
            left: 20px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid #5f5f61;
            content: '';
            display: block;
            z-index: 2;
        }

        li {
            padding: 10px;
            background-color: #5f5f61;
        }

        li:first-child {
            border-start-start-radius: 10px;
            border-start-end-radius: 10px;
        }

        li:last-child {
            border-end-start-radius: 10px;
            border-end-end-radius: 10px;
        }

        li:hover {
            cursor: pointer;
        }
    }
`

const DropdownInputLabel = styled.label`
    margin-bottom: 10px;
`

const DropdownInputComponent = styled.select`
    padding: 10px;
    padding-right: 25px;
    border: none;
    background: #F1F0F6;
    border-radius: 10px;
    outline: none;
   
    appearance: none;
    background-position: calc(100% - 5px) 50%;
    background-size: 14px;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml;charset=utf-8, <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' style='fill: rgba(0, 0, 0, 1);transform: ;msFilter:;'><path d='M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z'></path></svg>");
`

const DropdownInput = ({ title, children, id }) => {
    const createNewSelectorOptions = () => {
        const selectElement = $(`select#${id}`);
        const selectParentElement = selectElement.parent();

        if (!(selectParentElement.children('ul').length > 0)) {
            selectElement.each(index => {
                const select = $(selectElement[index]).children();
                let dropdown = '<ul class="selector-options hide">';

                select.each(index => {
                    dropdown += `<li>${$(select[index]).attr('label')}</li>`
                })
                dropdown += '</ul>';

                selectParentElement.append(dropdown)
            })
        }
    }

    const updateDefaultSelect = () => {
        const selectElement = $(`#${id}`);
        const selectorOptionElement = selectElement.parent().children('ul');

        selectElement.mousedown((event) => {
            event.preventDefault();
        })

        selectElement.on('click', (event) => {
            selectorOptionElement.toggleClass('hide')
        })
    }

    useEffect(() => {
        createNewSelectorOptions()
        updateDefaultSelect()
    }, [])

    return <DropdownInputContainer>
        <DropdownInputLabel><strong>{title}</strong></DropdownInputLabel>

        <DropdownInputComponent id={id}>
            {children}
        </DropdownInputComponent>
    </DropdownInputContainer>
}

export default DropdownInput;
