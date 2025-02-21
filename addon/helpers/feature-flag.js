import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';

export default Helper.extend({
  features: service(),

  /* eslint-disable ember/no-observers */
  compute([flag]) {
    if (this._observedFlag) {
      this.features.removeObserver(this._observedFlag, this, 'recompute');
    }

    this.set('_observedFlag', camelize(flag));
    this.features.addObserver(this._observedFlag, this, 'recompute');

    return this.features.isEnabled(flag);
  },

  _observedFlag: null,

  willDestroy() {
    this._super(...arguments);

    if (this._observedFlag) {
      this.features.removeObserver(this._observedFlag, this, 'recompute');
    }
  },
  /* eslint-enable ember/no-observers */
});
