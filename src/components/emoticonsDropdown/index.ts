import LazyLoadQueue from "../lazyLoadQueue";
import GifsTab from "./tabs/gifs";
import { touchSupport } from "../../lib/config";
import { findUpClassName, findUpTag, whichChild } from "../../lib/utils";
import { horizontalMenu } from "../horizontalMenu";
import animationIntersector from "../animationIntersector";
import appSidebarRight from "../../lib/appManagers/appSidebarRight";
import appImManager from "../../lib/appManagers/appImManager";
import Scrollable from "../scrollable_new";
import EmojiTab from "./tabs/emoji";
import StickersTab from "./tabs/stickers";
import StickyIntersector from "../stickyIntersector";

export const EMOTICONSSTICKERGROUP = 'emoticons-dropdown';

export interface EmoticonsTab {
  init: () => void,
  onCloseAfterTimeout?: () => void
}

const test = false;

export class EmoticonsDropdown {
  public static lazyLoadQueue = new LazyLoadQueue();
  private element: HTMLElement;

  public emojiTab: EmojiTab;
  public stickersTab: StickersTab;
  public gifsTab: GifsTab;

  private container: HTMLElement;
  private tabsEl: HTMLElement;
  private tabID = -1;

  private tabs: {[id: number]: EmoticonsTab};

  public searchButton: HTMLElement;
  public deleteBtn: HTMLElement;
  
  public toggleEl: HTMLElement;
  private displayTimeout: number;

  constructor() {
    this.element = document.getElementById('emoji-dropdown') as HTMLDivElement;

    let firstTime = true;
    this.toggleEl = document.getElementById('toggle-emoticons');
    if(touchSupport) {
      this.toggleEl.addEventListener('click', () => {
        if(firstTime) {
          firstTime = false;
          this.toggle(true);
        } else {
          this.toggle();
        }
      });
    } else {
      this.toggleEl.onmouseover = (e) => {
        clearTimeout(this.displayTimeout);
        //this.displayTimeout = setTimeout(() => {
          if(firstTime) {
            this.toggleEl.onmouseout = this.element.onmouseout = (e) => {
              if(test) return;
              const toElement = (e as any).toElement as Element;
              if(toElement && findUpClassName(toElement, 'emoji-dropdown')) {
                return;
              }

              clearTimeout(this.displayTimeout);
              this.displayTimeout = setTimeout(() => {
                this.toggle();
              }, 200);
            };
  
            this.element.onmouseover = (e) => {
              clearTimeout(this.displayTimeout);
            };

            firstTime = false;
          }

          this.toggle(true);
        //}, 0/* 200 */);
      };
    }
  }

  private init() {
    this.emojiTab = new EmojiTab();
    this.stickersTab = new StickersTab();
    this.gifsTab = new GifsTab();

    this.tabs = {
      0: this.emojiTab,
      1: this.stickersTab,
      2: this.gifsTab
    };

    this.container = this.element.querySelector('.emoji-container .tabs-container') as HTMLDivElement;
    this.tabsEl = this.element.querySelector('.emoji-tabs') as HTMLUListElement;
    horizontalMenu(this.tabsEl, this.container, (id) => {
      animationIntersector.checkAnimations(true, EMOTICONSSTICKERGROUP);

      this.tabID = id;
      this.searchButton.classList.toggle('hide', this.tabID == 0);
      this.deleteBtn.classList.toggle('hide', this.tabID != 0);
    }, () => {
      const tab = this.tabs[this.tabID];
      if(tab.init) {
        tab.init();
      }

      tab.onCloseAfterTimeout && tab.onCloseAfterTimeout();
      animationIntersector.checkAnimations(false, EMOTICONSSTICKERGROUP);
    });

    this.searchButton = this.element.querySelector('.emoji-tabs-search');
    this.searchButton.addEventListener('click', () => {
      if(this.tabID == 1) {
        appSidebarRight.stickersTab.init();
      } else {
        appSidebarRight.gifsTab.init();
      }
    });

    this.deleteBtn = this.element.querySelector('.emoji-tabs-delete');
    this.deleteBtn.addEventListener('click', () => {
      const input = appImManager.chatInputC.messageInput;
      if((input.lastChild as any)?.tagName) {
        input.lastElementChild.remove();
      } else if(input.lastChild) {
        if(!input.lastChild.textContent.length) {
          input.lastChild.remove();
        } else {
          input.lastChild.textContent = input.lastChild.textContent.slice(0, -1);
        }
      }

      const event = new Event('input', {bubbles: true, cancelable: true});
      appImManager.chatInputC.messageInput.dispatchEvent(event);
      //appSidebarRight.stickersTab.init();
    });

    (this.tabsEl.firstElementChild.children[1] as HTMLLIElement).click(); // set emoji tab
    this.tabs[0].init(); // onTransitionEnd не вызовется, т.к. это первая открытая вкладка
  }

  public toggle = async(enable?: boolean) => {
    //if(!this.element) return;
    const willBeActive = (!!this.element.style.display && enable === undefined) || enable;
    if(this.init) {
      if(willBeActive) {
        this.init();
        this.init = null;
      } else {
        return;
      }
    }

    if(touchSupport) {
      this.toggleEl.classList.toggle('flip-icon', willBeActive);
      if(willBeActive) {
        appImManager.chatInputC.saveScroll();
        // @ts-ignore
        document.activeElement.blur();
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
      }
    } else {
      this.toggleEl.classList.toggle('active', enable);
    }
    
    if((this.element.style.display && enable === undefined) || enable) {
      this.element.style.display = '';
      void this.element.offsetLeft; // reflow
      this.element.classList.add('active');

      EmoticonsDropdown.lazyLoadQueue.lockIntersection();
      //EmoticonsDropdown.lazyLoadQueue.unlock();
      animationIntersector.lockIntersectionGroup(EMOTICONSSTICKERGROUP);

      clearTimeout(this.displayTimeout);
      this.displayTimeout = setTimeout(() => {
        animationIntersector.unlockIntersectionGroup(EMOTICONSSTICKERGROUP);
        EmoticonsDropdown.lazyLoadQueue.unlockIntersection();
      }, touchSupport ? 0 : 200);

      /* if(touchSupport) {
        this.restoreScroll();
      } */
    } else {
      this.element.classList.remove('active');
      
      EmoticonsDropdown.lazyLoadQueue.lockIntersection();
      //EmoticonsDropdown.lazyLoadQueue.lock();

      // нужно залочить группу и выключить стикеры
      animationIntersector.lockIntersectionGroup(EMOTICONSSTICKERGROUP);
      animationIntersector.checkAnimations(true, EMOTICONSSTICKERGROUP);

      clearTimeout(this.displayTimeout);
      this.displayTimeout = setTimeout(() => {
        this.element.style.display = 'none';

        // теперь можно убрать visible, чтобы они не включились после фокуса
        animationIntersector.unlockIntersectionGroup(EMOTICONSSTICKERGROUP);

        EmoticonsDropdown.lazyLoadQueue.unlockIntersection();
      }, touchSupport ? 0 : 200);

      /* if(touchSupport) {
        this.restoreScroll();
      } */
    }

    //animationIntersector.checkAnimations(false, EMOTICONSSTICKERGROUP);
  };

  public static menuOnClick = (menu: HTMLUListElement, scroll: Scrollable, menuScroll?: Scrollable) => {
    let prevId = 0;
    let jumpedTo = -1;

    const setActive = (id: number) => {
      if(id == prevId) {
        return false;
      }

      menu.children[prevId].classList.remove('active');
      menu.children[id].classList.add('active');
      prevId = id;

      return true;
    };

    const stickyIntersector = new StickyIntersector(scroll.container, (stuck, target) => {
      //console.log('sticky scrollTOp', stuck, target, scroll.container.scrollTop);

      if(Math.abs(jumpedTo - scroll.container.scrollTop) <= 1) {
        return;
      } else {
        jumpedTo = -1;
      }

      const which = whichChild(target);
      if(!stuck && which) { // * due to stickyIntersector
        return;
      }

      setActive(which);

      if(menuScroll) {
        if(which < menu.childElementCount - 4) {
          menuScroll.container.scrollLeft = (which - 3) * 47;
        } else {
          menuScroll.container.scrollLeft = which * 47;
        }
      }
    });

    menu.addEventListener('click', (e) => {
      let target = e.target as HTMLElement;
      target = findUpTag(target, 'LI');

      if(!target) {
        return;
      }

      const which = whichChild(target);

      if(!setActive(which)) {
        return;
      }

      const element = (scroll.splitUp || scroll.container).children[which] as HTMLElement;
      const offsetTop = element.offsetTop + 1; // * due to stickyIntersector

      scroll.container.scrollTop = jumpedTo = offsetTop;

      //console.log('set scrollTop:', offsetTop);
    });

    return stickyIntersector;
  };

  public static onMediaClick = (e: MouseEvent) => {
    let target = e.target as HTMLElement;
    target = findUpTag(target, 'DIV');

    if(!target) return;
    
    let fileID = target.dataset.docID;
    if(appImManager.chatInputC.sendMessageWithDocument(fileID)) {
      /* dropdown.classList.remove('active');
      toggleEl.classList.remove('active'); */
      emoticonsDropdown.toggle(false);
    } else {
      console.warn('got no doc by id:', fileID);
    }
  };
}

const emoticonsDropdown = new EmoticonsDropdown();
// @ts-ignore
if(process.env.NODE_ENV != 'production') {
  (window as any).emoticonsDropdown = emoticonsDropdown;
}
export default emoticonsDropdown;