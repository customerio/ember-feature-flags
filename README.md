# ember-feature-flags [![Build Status](https://github.com/kategengler/ember-feature-flags/actions/workflows/ci.yml/badge.svg)](https://github.com/kategengler/ember-feature-flags/actions/workflows/ci.yml) [![Ember Observer Score](http://emberobserver.com/badges/ember-feature-flags.svg)](http://emberobserver.com/addons/ember-feature-flags)

An Ember addon to provide feature flags. This addon is published in **V2 format** for better tree-shaking and modern build tool compatibility.

### Versions

Tested against `ember-source` v4.12, v5.8, v5.12, v6.2, canary and beta.

For support for earlier `ember-source` use `ember-feature-flags@6.1.0`.

**Note:** This addon requires `ember-auto-import` >= 2.0.0 in consuming applications.

### Installation

```
ember install ember-feature-flags
```

### Usage

This addon provides a service named `features` available for injection into your routes, controllers, components, etc.

For example you may check if a feature is enabled:

```js
import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
export default class BillingPlansController extends Controller {
  @service features;
  get plans() {
    if (this.features.isEnabled("newBillingPlans")) {
      // Return new plans
    } else {
      // Return old plans
    }
  }
}
```

Check whether a feature is enabled in a template by using the `feature-flag` template helper:

```hbs
// templates/components/homepage-link.hbs
{{#if (feature-flag "newHomepage")}}
  {{link-to "new.homepage"}}
{{else}}
  {{link-to "old.homepage"}}
{{/if}}
```

Features can be toggled at runtime, and are bound:

```js
this.features.enable("newHomepage");
this.features.disable("newHomepage");
```

Features can be set in bulk, resetting all existing features:

```js
this.features.setup({
  "new-billing-plans": true,
  "new-homepage": false,
});
```

You may want to set the flags based on the result of a fetch:

```js
// routes/application.js
@service features;
beforeModel() {
   return fetch('/my-flag/api').then((data) => {
     features.setup(data.json());
  });
}
```

_NOTE:_ `setup` methods reset previously setup flags and their state.

You can get list of known feature flags via `flags` computed property:

```js
this.features.setup({
  "new-billing-plans": true,
  newHomepage: false,
});

this.features.flags; // ['new-billing-plans', 'newHomepage'] // Flags are exactly as they are passed in when set
```

### Configuration

#### `config.featureFlags`

You can configure a set of initial feature flags in your app's `config/environment.js` file. This
is an easy way to change settings for a given environment. For example:

```javascript
// config/environment.js
module.exports = function (environment) {
  var ENV = {
    featureFlags: {
      "show-spinners": true,
      "download-cats": false,
    },
  };

  if (environment === "production") {
    ENV.featureFlags["download-cats"] = true;
  }

  return ENV;
};
```

#### `ENV.LOG_FEATURE_FLAG_MISS`

Will log when a feature flag is queried and found to be off, useful to prevent cursing at the app,
wondering why your feature is not working.

### Test Helpers

#### `enableFeature` / `disableFeature`

Turns on or off a feature for the test in which it is called.
Requires ember-cli-qunit >= 4.1.0 and the newer style of tests that use `setupTest`, `setupRenderingTest`, `setupApplicationTest`.

Example:

```js
import {
  enableFeature,
  disableFeature,
} from "ember-feature-flags/test-support";

module("Acceptance | Awesome page", function (hooks) {
  setupApplicationTest(hooks);

  test("it displays the expected welcome message", async function (assert) {
    enableFeature("new-welcome-message");

    await visit("/");

    assert.dom("h1.welcome-message").hasText("Welcome to the new website!");

    disableFeature("new-welcome-message");

    await settled();

    assert
      .dom("h1.welcome-message")
      .hasText("This is our old website, upgrade coming soon");
  });
});
```

### Integration Tests

If you use `this.features.isEnabled()` in components under integration test, you will need to inject a stub service in your tests. Using ember-qunit 0.4.16 or later, here's how to do this:

```js
let featuresService = Service.extend({
  isEnabled() {
    return false;
  },
});

moduleForComponent("my-component", "Integration | Component | my component", {
  integration: true,
  beforeEach() {
    this.register("service:features", featuresService);
    getOwner(this).inject("component", "features", "service:features");
  },
});
```

Note: for Ember before 2.3.0, you'll need to use [ember-getowner-polyfill](https://github.com/rwjblue/ember-getowner-polyfill).

### Development

This addon is built as a **V2 addon** using modern tooling:

- **Build System**: Uses Rollup for efficient bundling
- **Module Format**: ES modules with proper tree-shaking
- **Vite Support**: Fully compatible with Vite-based Ember applications
- **Monorepo**: Organized with separate `addon` and `test-app` workspaces

#### Development Setup

```bash
# Install dependencies
pnpm install

# Run tests
cd test-app && pnpm test:ember

# Start development server
cd test-app && pnpm start

# Lint test app
cd test-app && pnpm lint

# Lint addon code
cd addon && pnpm lint

# Build addon
cd addon && pnpm build

# Watch mode for addon development
cd addon && pnpm start
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
