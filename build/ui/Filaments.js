import { getOpacity } from "../tools/AutoOpacity.js";
export function getFilamentListElements() {
    const draggableList = document.getElementById("draggable-list");
    if (!draggableList) {
        console.error("Draggable list element not found.");
        return [];
    }
    const filamentLayers = draggableList.querySelectorAll(".draggable-item");
    const filamentDataList = [];
    filamentLayers.forEach((layer) => {
        const nameInput = layer.querySelector("input[readonly]");
        const colorInput = layer.querySelector('input[type="color"]');
        const opacityInput = layer.querySelector(".filament-layer-opacity");
        const layerHeightInput = layer.querySelector(".layer-height-number");
        if (nameInput && colorInput && opacityInput && layerHeightInput) {
            const opacity = parseFloat(opacityInput.value);
            const layerHeight = parseFloat(layerHeightInput.value);
            if (!isNaN(opacity) && !isNaN(layerHeight)) {
                filamentDataList.push({
                    name: nameInput.value,
                    color: colorInput.value,
                    opacity: opacity,
                    layerHeight: layerHeight,
                });
            }
        }
    });
    return filamentDataList;
}
let filamentIdCounter = 0;
export function setupDragAndDrop(callback) {
    const draggableList = document.getElementById("draggable-list");
    const addItemButtonNew = document.getElementById("add-item-button-new");
    const addItemButtonExisting = document.getElementById("add-item-button-existing");
    const filamentList = document.getElementById("existing-filament-list");
    const existingFilamentSelection = document.getElementById("existing-filament-selection");
    const globalLayerHeightInput = document.getElementById("layer-height-input");
    const itemClassName = "draggable-item";
    const dragHandleClassName = "drag-handle";
    const newItemPrefix = "Filament Layer";
    let draggedItem = null;
    if (!draggableList || !addItemButtonNew || !addItemButtonExisting || !filamentList || !existingFilamentSelection) {
        console.error("Required elements not found.");
        return;
    }
    const attachDragHandlers = (dragHandle) => {
        dragHandle.setAttribute("draggable", "true");
        dragHandle.addEventListener("dragstart", (e) => {
            const target = e.target;
            if (target.classList.contains(dragHandleClassName)) {
                draggedItem = target.parentElement;
                if (draggedItem) {
                    draggedItem.classList.add("dragging");
                }
                else {
                    e.preventDefault();
                }
            }
        });
    };
    draggableList.querySelectorAll(`.${dragHandleClassName}`).forEach(attachDragHandlers);
    draggableList.addEventListener("dragend", (e) => {
        if (draggedItem) {
            draggedItem.classList.remove("dragging");
            draggedItem = null;
        }
        callback(draggableList);
    });
    draggableList.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (draggedItem) {
            const afterElement = getDragAfterElement(draggableList, e.clientY, itemClassName);
            if (afterElement == null) {
                draggableList.appendChild(draggedItem);
            }
            else {
                draggableList.insertBefore(draggedItem, afterElement);
            }
        }
    });
    const updateFilamentLayersName = (filamentId, newName) => {
        const filamentLayers = draggableList.querySelectorAll(`.${itemClassName}[data-id="${filamentId}"]`);
        filamentLayers.forEach((layer) => {
            const nameInput = layer.querySelector("input[readonly]");
            if (nameInput) {
                nameInput.value = newName;
            }
        });
        const option = existingFilamentSelection.querySelector(`option[data-id="${filamentId}"]`);
        if (option) {
            option.textContent = newName;
            option.value = newName;
        }
    };
    const updateFilamentLayers = (filamentName, color, opacity) => {
        const filamentLayers = draggableList.querySelectorAll(`.${itemClassName}`);
        filamentLayers.forEach((layer) => {
            const nameInput = layer.querySelector("input[readonly]");
            if (nameInput && nameInput.value === filamentName) {
                const colorInput = layer.querySelector('input[type="color"]');
                const opacityInput = layer.querySelector(".filament-layer-opacity");
                if (colorInput)
                    colorInput.value = color;
                if (opacityInput)
                    opacityInput.value = opacity;
            }
        });
    };
    const updateFilamentListEntry = (filamentId, color, opacity) => {
        const filamentListItem = filamentList.querySelector(`.filament-list-item[data-id="${filamentId}"]`);
        if (filamentListItem) {
            const nameSpan = filamentListItem.querySelector("span");
            const colorInput = filamentListItem.querySelectorAll('input[type="color"]')[0];
            const hexInput = filamentListItem.querySelectorAll('input[type="text"]')[1];
            const opacityInput = filamentListItem.querySelectorAll('input[type="number"]')[0];
            if (nameSpan && colorInput && hexInput && opacityInput) {
                let newColor;
                if (colorInput.matches(":focus")) {
                    newColor = colorInput.value;
                    hexInput.value = newColor;
                }
                else if (hexInput.matches(":focus")) {
                    newColor = hexInput.value;
                    colorInput.value = newColor;
                }
                else {
                    newColor = colorInput.value;
                }
            }
        }
    };
    const updateLayerHeight = (layerItem, value) => {
        const slider = layerItem.querySelector(".layer-height-slider");
        const numberInput = layerItem.querySelector(".layer-height-number");
        if (slider && numberInput) {
            slider.value = value.toString();
            numberInput.value = value.toString();
        }
    };
    const roundToNearestMultiple = (value, multiple) => {
        return Math.round(value / multiple) * multiple;
    };
    const handleLayerHeightChange = (event) => {
        const target = event.target;
        const layerItem = target.closest(`.${itemClassName}`);
        const globalLayerHeight = parseFloat(globalLayerHeightInput.value);
        if (layerItem && !isNaN(globalLayerHeight)) {
            let newValue = parseFloat(target.value);
            if (target.classList.contains("layer-height-number")) {
                newValue = roundToNearestMultiple(newValue, globalLayerHeight);
            }
            const min = parseFloat(target.min) || 0;
            const max = parseFloat(target.max) || Infinity;
            newValue = Math.max(min, Math.min(newValue, max));
            updateLayerHeight(layerItem, newValue);
            callback(draggableList);
        }
    };
    draggableList.querySelectorAll(`.${itemClassName}`).forEach((layerItem) => {
        layerItem.querySelector(".layer-height-slider")?.addEventListener("input", handleLayerHeightChange);
        layerItem.querySelector(".layer-height-number")?.addEventListener("change", handleLayerHeightChange);
    });
    filamentList.addEventListener("change", (event) => {
        const target = event.target;
        const listItem = target.closest(".filament-list-item");
        if (listItem) {
            const filamentId = listItem.dataset.id;
            const nameSpan = listItem.querySelector("span");
            const nameInput = listItem.querySelector('input[type="text"]');
            const colorInput = listItem.querySelectorAll('input[type="color"]')[0];
            const hexInput = listItem.querySelectorAll('input[type="text"]')[1];
            const opacityInput = listItem.querySelectorAll('input[type="number"]')[0];
            const deleteButton = listItem.querySelector(".delete-filament-button");
            if (filamentId && nameSpan && nameInput && colorInput && hexInput && opacityInput) {
                if (target === nameInput) {
                    updateFilamentLayersName(filamentId, nameInput.value);
                    nameSpan.textContent = nameInput.value;
                }
                else {
                    let newColor;
                    if (target === colorInput) {
                        newColor = colorInput.value;
                        hexInput.value = newColor;
                    }
                    else if (target === hexInput) {
                        newColor = hexInput.value;
                        colorInput.value = newColor;
                    }
                    else {
                        newColor = colorInput.value;
                    }
                    updateFilamentLayers(nameSpan.textContent || "", newColor, opacityInput.value);
                }
            }
            if (target === deleteButton && filamentId) {
                deleteFilament(filamentId);
            }
        }
    });
    const updateOpacityFromColorInput = (colorInput, opacityInput) => {
        const hexColor = colorInput.value;
        if (hexColor) {
            const r = parseInt(hexColor.substring(1, 3), 16) / 255;
            const g = parseInt(hexColor.substring(3, 5), 16) / 255;
            const b = parseInt(hexColor.substring(5, 7), 16) / 255;
            opacityInput.value = getOpacity(r, g, b).toFixed(2);
        }
    };
    {
        const newNameInput = document
            .querySelector("#add-item-button-new")
            ?.parentElement?.querySelector('input[type="text"]');
        const newColorInput = document
            .querySelector("#add-item-button-new")
            ?.parentElement?.querySelector('input[type="color"]');
        const newHexInput = document
            .querySelector("#add-item-button-new")
            ?.parentElement?.querySelector('input[type="text"][placeholder="Hex Code"]');
        const newOpacityInput = document
            .querySelector("#add-item-button-new")
            ?.parentElement?.querySelectorAll('input[type="number"]')[0];
        if (newNameInput && newColorInput && newHexInput && newOpacityInput) {
            newNameInput.value = `Filament ${filamentList.querySelectorAll(".filament-list-item").length + 1}`;
            newColorInput.value = "#000000";
            newHexInput.value = "#000000";
            newOpacityInput.value = "0.10";
            newColorInput.addEventListener("input", () => {
                newHexInput.value = newColorInput.value;
                updateOpacityFromColorInput(newColorInput, newOpacityInput);
            });
            newHexInput.addEventListener("input", () => {
                newColorInput.value = newHexInput.value;
                updateOpacityFromColorInput(newColorInput, newOpacityInput);
            });
        }
    }
    addItemButtonNew.addEventListener("click", () => {
        const newNameInput = document
            .querySelector("#add-item-button-new")
            ?.parentElement?.querySelector('input[type="text"]');
        const newColorInput = document
            .querySelector("#add-item-button-new")
            ?.parentElement?.querySelector('input[type="color"]');
        const newHexInput = document
            .querySelector("#add-item-button-new")
            ?.parentElement?.querySelector('input[type="text"][placeholder="Hex Code"]');
        const newOpacityInput = document
            .querySelector("#add-item-button-new")
            ?.parentElement?.querySelectorAll('input[type="number"]')[0];
        if (newNameInput && newColorInput && newHexInput && newOpacityInput) {
            const newFilamentName = newNameInput.value;
            const newFilamentColor = newColorInput.value;
            const filamentId = `filament-${filamentIdCounter++}`;
            const initialLayerHeight = parseFloat(globalLayerHeightInput.value) || 0.08;
            if (!newFilamentColor) {
                alert("Please select a color for the new filament.");
                return;
            }
            const newLayerItem = document.createElement("li");
            newLayerItem.classList.add(itemClassName);
            newLayerItem.dataset.id = filamentId;
            newLayerItem.innerHTML = `
                <div class="${dragHandleClassName}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9H21V11H3V9ZM3 15H21V17H3V15Z" fill="currentColor"/>
                    </svg>
                </div>
                <div class="row">
                    <span>Name: <input type="text" value="${newFilamentName}" readonly/></span>
                </div>
                <div class="row">
                    Colour: <div class="h-gap-small"></div> <input type="color" value="${newFilamentColor}" disabled/>
                    <div class="h-gap"></div>
                    Opacity: <div class="h-gap-small"></div> <input type="number" step="0.01" min="0" max="5" value="${newOpacityInput.value}" class="filament-layer-opacity" readonly/>
                </div>
                <div class="row">
                    Layer Height:
                    <div class="h-gap-small"></div>
                    <input type="range" min="0.00" max="2" step="${globalLayerHeightInput.value}" value="${initialLayerHeight}" class="layer-height-slider">
                    <div class="h-gap"></div>
                    <input type="number" min="0.00" max="2" step="0.01" value="${initialLayerHeight}" class="layer-height-number">
                    <div class="h-gap-small"></div> mm
                </div>
                <button class="delete-layer-button">Delete</button>
            `;
            draggableList.appendChild(newLayerItem);
            attachDragHandlers(newLayerItem.querySelector(`.${dragHandleClassName}`));
            newLayerItem.querySelector(".layer-height-slider")?.addEventListener("input", handleLayerHeightChange);
            newLayerItem.querySelector(".layer-height-number")?.addEventListener("change", handleLayerHeightChange);
            newLayerItem.querySelector(".delete-layer-button")?.addEventListener("click", (event) => {
                const layerToRemove = event.target?.closest(`.${itemClassName}`);
                if (layerToRemove) {
                    deleteFilamentLayer(layerToRemove);
                }
            });
            updateSliderSteps();
            const newFilamentListItem = document.createElement("li");
            newFilamentListItem.classList.add("filament-list-item");
            newFilamentListItem.dataset.id = filamentId;
            newFilamentListItem.innerHTML = `
                <span>${newFilamentName}</span>
                <div class="row">
                    <span>Name: <input type="text" value="${newFilamentName}"/></span>
                </div>
                <div class="row">
                    <span>Color: <input type="color" value="${newFilamentColor}"/> <input type="text" placeholder="Hex Code" value="${newFilamentColor}"/></span>
                </div>
                <div class="row">
                    <span>Opacity: <input type="number" step="0.01" min="0" max="1" value="${newOpacityInput.value}"/> mm</span>
                </div>
            `;
            filamentList.appendChild(newFilamentListItem);
            const newOption = document.createElement("option");
            newOption.value = newFilamentName;
            newOption.textContent = newFilamentName;
            newOption.dataset.id = filamentId;
            existingFilamentSelection.appendChild(newOption);
            newNameInput.value = `Filament ${filamentList.querySelectorAll(".filament-list-item").length + 1}`;
            newColorInput.value = "#000000";
            newHexInput.value = "#000000";
            newOpacityInput.value = "0.10";
            newColorInput.addEventListener("input", () => {
                newHexInput.value = newColorInput.value;
                updateOpacityFromColorInput(newColorInput, newOpacityInput);
            });
            newHexInput.addEventListener("input", () => {
                newColorInput.value = newHexInput.value;
                updateOpacityFromColorInput(newColorInput, newOpacityInput);
            });
            callback(draggableList);
        }
    });
    addItemButtonExisting.addEventListener("click", () => {
        const selectedOption = existingFilamentSelection.options[existingFilamentSelection.selectedIndex];
        const selectedFilamentId = selectedOption.dataset.id;
        const selectedFilamentName = selectedOption.value;
        if (selectedFilamentId && selectedFilamentName !== "None") {
            const filamentListItem = Array.from(filamentList.querySelectorAll(`.filament-list-item[data-id="${selectedFilamentId}"]`))[0];
            const initialLayerHeight = parseFloat(globalLayerHeightInput.value) || 0.08;
            if (filamentListItem) {
                const nameInput = filamentListItem.querySelector('input[type="text"]');
                const colorInput = filamentListItem.querySelectorAll('input[type="color"]')[0];
                const opacityInput = filamentListItem.querySelectorAll('input[type="number"]')[0];
                if (nameInput && colorInput && opacityInput) {
                    const existingFilamentColor = colorInput.value;
                    const existingFilamentOpacity = opacityInput.value;
                    const newLayerItem = document.createElement("li");
                    newLayerItem.classList.add(itemClassName);
                    newLayerItem.dataset.id = selectedFilamentId;
                    newLayerItem.innerHTML = `
                    <div class="${dragHandleClassName}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 9H21V11H3V9ZM3 15H21V17H3V15Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <div class="row">
                        <span>Name: <input type="text" value="${selectedFilamentName}" readonly/></span>
                    </div>
                    <div class="row">
                        Colour: <div class="h-gap-small"></div> <input type="color" value="${existingFilamentColor}" disabled/>
                        <div class="h-gap"></div>
                        Opacity: <div class="h-gap-small"></div> <input type="number" step="0.01" min="0" max="5" value="${existingFilamentOpacity}" class="filament-layer-opacity" readonly/>
                    </div>
                    <div class="row">
                        Layer Height:
                        <div class="h-gap-small"></div>
                        <input type="range" min="0.00" max="2" step="${globalLayerHeightInput.value}" value="${initialLayerHeight}" class="layer-height-slider">
                        <div class="h-gap"></div>
                        <input type="number" min="0.00" max="2" step="0.01" value="${initialLayerHeight}" class="layer-height-number">
                        <div class="h-gap-small"></div> mm
                    </div>
                    <button class="delete-layer-button">Delete</button>
                `;
                    draggableList.appendChild(newLayerItem);
                    attachDragHandlers(newLayerItem.querySelector(`.${dragHandleClassName}`));
                    newLayerItem.querySelector(".layer-height-slider")?.addEventListener("input", handleLayerHeightChange);
                    newLayerItem.querySelector(".layer-height-number")?.addEventListener("change", handleLayerHeightChange);
                    newLayerItem.querySelector(".delete-layer-button")?.addEventListener("click", (event) => {
                        const layerToRemove = event.target?.closest(`.${itemClassName}`);
                        if (layerToRemove) {
                            deleteFilamentLayer(layerToRemove);
                        }
                    });
                    updateSliderSteps();
                    callback(draggableList);
                }
            }
        }
    });
    const deleteFilamentLayer = (layerItem) => {
        draggableList.removeChild(layerItem);
        callback(draggableList);
    };
    const deleteFilament = (filamentId) => {
        draggableList.querySelectorAll(`.${itemClassName}[data-id="${filamentId}"]`).forEach((layer) => {
            draggableList.removeChild(layer);
        });
        const filamentListItem = filamentList.querySelector(`.filament-list-item[data-id="${filamentId}"]`);
        if (filamentListItem) {
            filamentList.removeChild(filamentListItem);
        }
        const optionToRemove = existingFilamentSelection.querySelector(`option[data-id="${filamentId}"]`);
        if (optionToRemove) {
            existingFilamentSelection.removeChild(optionToRemove);
        }
        callback(draggableList);
    };
    filamentList.addEventListener("change", (event) => {
        const target = event.target;
        const listItem = target.closest(".filament-list-item");
        if (listItem) {
            const filamentId = listItem.dataset.id;
            const nameSpan = listItem.querySelector("span");
            const nameInput = listItem.querySelector('input[type="text"]');
            const colorInput = listItem.querySelectorAll('input[type="color"]')[0];
            const hexInput = listItem.querySelectorAll('input[type="text"]')[1];
            const opacityInput = listItem.querySelectorAll('input[type="number"]')[0];
            const deleteButton = listItem.querySelector(".delete-filament-button");
            if (filamentId && nameSpan && nameInput && colorInput && hexInput && opacityInput) {
                if (target === nameInput) {
                    updateFilamentLayersName(filamentId, nameInput.value);
                    nameSpan.textContent = nameInput.value;
                }
                else {
                    let newColor;
                    if (target === colorInput) {
                        newColor = colorInput.value;
                        hexInput.value = newColor;
                    }
                    else if (target === hexInput) {
                        newColor = hexInput.value;
                        colorInput.value = newColor;
                    }
                    else {
                        newColor = colorInput.value;
                    }
                    updateFilamentLayers(nameSpan.textContent || "", newColor, opacityInput.value);
                }
            }
            if (target === deleteButton && filamentId) {
                deleteFilament(filamentId);
            }
        }
    });
    const updateSliderSteps = () => {
        const globalLayerHeight = parseFloat(globalLayerHeightInput.value);
        if (!isNaN(globalLayerHeight)) {
            draggableList.querySelectorAll(".layer-height-slider").forEach((slider) => {
                slider.step = globalLayerHeight.toString();
            });
        }
    };
    const updateSliderStepsOnGlobalChange = () => {
        updateSliderSteps();
    };
    globalLayerHeightInput.addEventListener("input", updateSliderStepsOnGlobalChange);
    updateSliderSteps();
}
function getDragAfterElement(container, y, itemClassName) {
    const draggableElements = [
        ...container.querySelectorAll(`.${itemClassName}:not(.dragging)`),
    ];
    return Array.from(draggableElements).reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        }
        else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}
