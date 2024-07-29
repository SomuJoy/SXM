import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SxmUiModalComponent } from './modal.component';

const stories = storiesOf('Component Library/Containers/Modal', module)
    .addDecorator(withA11y)
    .addDecorator(moduleMetadata({ declarations: [SxmUiModalComponent] }));

stories.addDecorator(withKnobs);

stories.add('default', () => ({
    template: `<sxm-ui-modal [showBackButton]="true" [closed]="false" title="Modal by default" [titlePresent]="true">
                    <p>Story to show what the modal looks like by default</p>
                </sxm-ui-modal>`
}));

// tslint:disable:max-line-length
stories.add('modal-full-view', () => ({
    template: `<sxm-ui-modal class="modal--full-view" [showBackButton]="true" [closed]="false" title="Modal by default" [titlePresent]="true">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et vestibulum purus. Vestibulum vitae nulla sed tortor faucibus dictum. Quisque vestibulum, dolor cursus tincidunt pulvinar, ante velit commodo sem, sit amet congue velit augue eu nibh. In id ornare ligula. Vivamus at felis suscipit, viverra lorem et, pellentesque lacus. Maecenas laoreet placerat fermentum. Nam sagittis, tellus quis fringilla vehicula, quam magna iaculis enim, id pellentesque erat ante at sapien. Nunc faucibus sit amet purus eu pulvinar. Maecenas tortor ligula, accumsan eget hendrerit ut, vehicula at tortor. Proin ultricies id augue id porttitor. Nulla id mi non neque imperdiet dictum ac eget est. Nullam at augue venenatis, cursus tortor ut, aliquam elit.Mauris vitae malesuada lectus. Aenean sollicitudin nulla sit amet lacus pulvinar, at dapibus dolor egestas. Vivamus non mauris in urna sagittis congue. Morbi porta quam sit amet sem lobortis scelerisque. Sed porta elit eros, ut malesuada diam viverra ut. Integer sodales pellentesque scelerisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras neque urna, posuere ut iaculis ut, aliquam non nibh. Etiam tempor semper erat, eu viverra tortor. Morbi ligula enim, elementum sed dui a, volutpat porttitor dolor. Nam viverra nisl sit amet sagittis luctus. Nunc et urna lorem. In hac habitasse platea dictumst. Donec ut efficitur elit.Praesent gravida velit non nisi placerat cursus. Sed quis sem non eros semper imperdiet. Pellentesque sed felis nec purus eleifend aliquet. Vivamus hendrerit, odio nec facilisis placerat, libero lacus blandit quam, non egestas elit nulla ut ex. In vel gravida nisi. Nullam metus sem, fringilla quis enim eu, fermentum porta elit. Sed ut accumsan ligula. Cras eu finibus nisi. Quisque sed arcu erat. Suspendisse arcu dui, feugiat vel lacus vitae, interdum luctus tellus. Mauris aliquet velit eget ipsum egestas porttitor sit amet eu felis. Nullam lacinia tincidunt lorem, sit amet fringilla augue bibendum sollicitudin.Pellentesque quis nibh mollis, feugiat nulla at, malesuada libero. Aliquam magna justo, sodales ac dictum nec, vulputate vitae justo. Cras sem odio, rutrum sit amet tempus sed, cursus id nisl. Nullam tincidunt arcu et varius mollis. Fusce faucibus, ex sed pretium tincidunt, ex lorem tincidunt nunc, sed mattis urna quam quis lacus. In quis consectetur arcu, sit amet sollicitudin ante. Morbi fringilla tortor risus. Pellentesque eu lorem et libero vulputate sagittis ut nec risus. Etiam vulputate odio vitae ligula pellentesque iaculis. Donec id elementum orci. Donec sed semper mauris. Pellentesque eget auctor mi, ac sagittis turpis. Duis purus ante, sodales at dignissim id, vulputate vitae purus.Nulla elementum purus convallis, congue neque eu, maximus augue. Nunc vitae lacus ac mauris elementum scelerisque. Aliquam nec dolor eget erat ornare posuere. Phasellus bibendum sodales neque. Integer elementum ipsum nisi, vel ultrices odio condimentum quis. Integer volutpat leo sed sodales gravida. Curabitur posuere sodales tortor et cursus. Ut pretium vehicula est et fringilla. Nulla in lorem pulvinar, mollis dui in, ultricies elit.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et vestibulum purus. Vestibulum vitae nulla sed tortor faucibus dictum. Quisque vestibulum, dolor cursus tincidunt pulvinar, ante velit commodo sem, sit amet congue velit augue eu nibh. In id ornare ligula. Vivamus at felis suscipit, viverra lorem et, pellentesque lacus. Maecenas laoreet placerat fermentum. Nam sagittis, tellus quis fringilla vehicula, quam magna iaculis enim, id pellentesque erat ante at sapien. Nunc faucibus sit amet purus eu pulvinar. Maecenas tortor ligula, accumsan eget hendrerit ut, vehicula at tortor. Proin ultricies id augue id porttitor. Nulla id mi non neque imperdiet dictum ac eget est. Nullam at augue venenatis, cursus tortor ut, aliquam elit.Pellentesque quis nibh mollis, feugiat nulla at, malesuada libero. Aliquam magna justo, sodales ac dictum nec, vulputate vitae justo. Cras sem odio, rutrum sit amet tempus sed, cursus id nisl. Nullam tincidunt arcu et varius mollis. Fusce faucibus, ex sed pretium tincidunt, ex lorem tincidunt nunc, sed mattis urna quam quis lacus. In quis consectetur arcu, sit amet sollicitudin ante. Morbi fringilla tortor risus. Pellentesque eu lorem et libero vulputate sagittis ut nec risus. Etiam vulputate odio vitae ligula pellentesque iaculis. Donec id elementum orci. Donec sed semper mauris. Pellentesque eget auctor mi, ac sagittis turpis. Duis purus ante, sodales at dignissim id, vulputate vitae purus.Nulla elementum purus convallis, congue neque eu, maximus augue. Nunc vitae lacus ac mauris elementum scelerisque. Aliquam nec dolor eget erat ornare posuere. Phasellus bibendum sodales neque. Integer elementum ipsum nisi, vel ultrices odio condimentum quis. Integer volutpat leo sed sodales gravida. Curabitur posuere sodales tortor et cursus. Ut pretium vehicula est et fringilla. Nulla in lorem pulvinar, mollis dui in, ultricies elit.</p>
                </sxm-ui-modal>`
}));