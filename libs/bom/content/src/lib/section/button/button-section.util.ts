import { ButtonAction, ColorIonic } from "@bk/categories";
import { Button, Icon } from "@bk/models";

export function newButton(width = '60px', height = '60px'): Button {
    return {
        label: '',
        shape: 'round',
        fill: 'clear',
        width: width,
        height: height,
        color: ColorIonic.Primary,
        buttonAction: ButtonAction.None
    };
}

export function newIcon(): Icon {
    return {
        name: 'pdf',
        size: '40px',
        slot: 'start'
    };
}
