import { loadRemoteModule } from '@angular-architects/module-federation';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Declare the module federation remote
declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: any };

@Component({
  selector: 'app-react-wrapper',
  template: `
    <div class="react-container">
      <h2>React Remote Application Loaded in Angular</h2>
      <div #reactRoot class="react-mount-point"></div>
    </div>
  `,
  styles: [`
    .react-container {
      padding: 20px;
      border: 2px solid #dd0031;
      border-radius: 8px;
      margin: 20px 0;
    }

    .react-container h2 {
      color: #dd0031;
      text-align: center;
      margin-bottom: 20px;
    }

    .react-mount-point {
      min-height: 200px;
    }
  `]
})
export class ReactWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('reactRoot', { static: true }) reactRoot!: ElementRef;
  private unmountReact?: () => void;

  async ngOnInit() {
    try {
      // Load the remote module directly
      const remoteModule = await loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:5001/assets/remoteEntry.js',
        exposedModule: './ReactApp',
      });

      // Get the mount function from remote React module
      const { mount } = remoteModule;

      // Mount the React app into Angular template host element
      this.unmountReact = mount(this.reactRoot.nativeElement);

    } catch (error) {
      console.error('Error loading React remote:', error);
      this.reactRoot.nativeElement.innerHTML = `
        <div style="color: red; text-align: center; padding: 20px;">
          <h3>Failed to load React Remote</h3>
          <p>Make sure the React remote is running on port 5001</p>
          <p>Error: ${error}</p>
        </div>
      `;
    }
  }

  // async ngOnInit() {
  //   try {
  //
  //     const remoteModule = await loadRemoteModule(
  //       {
  //         type: 'module',
  //         remoteEntry: 'http://localhost:5001/assets/remoteEntry.js',
  //         exposedModule: './ReactApp',
  //       }
  //     );
  //     // Initialize sharing scope
  //     await __webpack_init_sharing__('default');
  //
  //     // Load the remote module
  //     const container = (window as any).remoteApp;
  //     await container.init(__webpack_share_scopes__.default);
  //
  //     // Get the mount function
  //     const factory = await container.get('./ReactApp');
  //     const { mount } = factory();
  //
  //     // Mount React app
  //     this.unmountReact = mount(this.reactRoot.nativeElement);
  //   } catch (error) {
  //     console.error('Error loading React remote:', error);
  //     this.reactRoot.nativeElement.innerHTML = `
  //       <div style="color: red; text-align: center; padding: 20px;">
  //         <h3>Failed to load React Remote</h3>
  //         <p>Make sure the React remote is running on port 4201</p>
  //         <p>Error: ${error}</p>
  //       </div>
  //     `;
  //   }
  // }

  ngOnDestroy() {
    // Cleanup when Angular destroys the component
    if (this.unmountReact) {
      this.unmountReact();
    }
  }
}
