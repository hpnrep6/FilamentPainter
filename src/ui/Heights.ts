import {config} from "../config/Config.js";
import {HeightFunction} from "../config/Paint.js";
import {autoUpdateImage} from "./UpdateImage.js";

export function setupHeightSelector() {
    const heightOptionSelection = document.getElementById('height-option-selection') as HTMLSelectElement;

    if (heightOptionSelection) {
        heightOptionSelection.addEventListener('change', (event: Event) => {
            const selectedValue = (event.target as HTMLSelectElement).value;

            switch (selectedValue) {
                case 'nearest':
                    config.paint.heightFunction = HeightFunction.NEAREST;
                    autoUpdateImage();
                    break;
                case 'greyscale-luminance':
                    config.paint.heightFunction = HeightFunction.GREYSCALE_LUMINANCE;
                    autoUpdateImage();
                    break;
                case 'greyscale-max':
                    config.paint.heightFunction = HeightFunction.GREYSCALE_MAX;
                    autoUpdateImage();
                    break;
                default:
                    console.error('Unknown selection');
            }
        });
    }
}