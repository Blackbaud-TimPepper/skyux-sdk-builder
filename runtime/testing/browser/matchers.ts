const _global: any = (typeof window === 'undefined' ? global : window);

interface SkyMatchResult {
  pass: boolean;
  message: string;
}

const skyMatchers: jasmine.CustomMatcherFactories = {
  toBeVisible: () => {
    return {
      compare: (el: Element): SkyMatchResult => {
        const result = {
          pass: false,
          message: ''
        };

        result.pass = getComputedStyle(el).display !== 'none';

        result.message = result.pass ?
          'Expected element to not be visible' :
          'Expected element to be visible';

        return result;
      }
    };
  },

  toHaveText: () => {
    return {
      compare: (el: any, expectedText: string, trimWhitespace = true): SkyMatchResult => {
        const result = {
          pass: false,
          message: ''
        };

        let actualText = el.textContent;

        if (trimWhitespace) {
          actualText = actualText.trim();
        }

        result.pass = actualText === expectedText;

        result.message = result.pass ?
          'Expected element\'s inner text not to be ' + expectedText :
          `Expected element's inner text to be:\t${expectedText}\n` +
          `Actual element's inner text was:    \t${actualText}`;

        return result;
      }
    };
  },

  toHaveCssClass: () => {
    return {
      compare: (el: any, expectedCls: string): SkyMatchResult => {
        const result = {
          pass: false,
          message: ''
        };

        if (expectedCls.indexOf('.') === 0) {
          throw new Error('Please remove the leading dot from your class name.');
        }

        result.pass = el.classList.contains(expectedCls);

        result.message = result.pass ?
          'Expected element not to have CSS class ' + expectedCls :
          'Expected element to have CSS class ' + expectedCls;

        return result;
      }
    };
  },

  toHaveStyle: () => {
    return {
      compare: (el: any, expectedStyle: any): SkyMatchResult => {
        const result = {
          pass: false,
          message: ''
        };

        for (const p in expectedStyle) {
          if (expectedStyle.hasOwnProperty(p)) {
            const actualStyle = (getComputedStyle(el) as any)[p];

            if (actualStyle !== expectedStyle[p]) {
              if (result.message) {
                result.message += '\n';
              }

              result.message += result.pass ?
                'Expected element not to have CSS style ' + p + ': ' + expectedStyle :
                'Expected element to have CSS style ' + p + ': ' + expectedStyle;
            }
          }
        }

        return result;
      }
    };
  },

  toExist: () => {
    return {
      compare: (el: any): SkyMatchResult => {
        const result = {
          pass: false,
          message: ''
        };

        result.pass = !!el;

        result.message = result.pass ?
          'Expected element not to exist' :
          'Expected element to exist';

        return result;
      }
    };
  }
};

_global.beforeEach(() => {
  jasmine.addMatchers(skyMatchers);
});

export const expect: Function = _global.expect;
