import 'reflect-metadata';
import { createInterface }  from '../functions/createInterface';
import { implementationOf } from '../decorators/implementationOf';

describe('Interface @implementationOf decorator and createInterface function', () => {
  test(`should work`, async () => {

    const IFoo = createInterface<IFoo>('IFoo');
    const IBar = createInterface<IBar>('IBar');

    interface IFoo {
      helloFoo(): string;
    }

    interface IBar {
      helloBar(): string;
    }

    @implementationOf(IFoo)
    class Foo implements IFoo {
      helloFoo(): string {
        return 'helloFoo';
      }
    }

    // TS warnings will also work without implements keyword
    @implementationOf(IBar)
    class Bar {
      helloBar(): string {
        return 'helloBar';
      }
    }

    const foo = new Foo();
    const bar = new Bar();
    const baz = {};

    // magic!
    expect(bar instanceof IFoo).toBe(false)
    expect(foo instanceof IFoo).toBe(true);

    if (bar instanceof IFoo) {
      // TS type checking also works
      bar.helloFoo();
      fail('bar is not instance of IFoo');
    }

    if (baz instanceof IFoo) {
      // TS type checking also works
      baz.helloFoo();
      fail('baz is not instance of IFoo');
    }
  });
});
