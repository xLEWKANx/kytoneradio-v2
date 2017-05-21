import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import ConditionalField from './ConditionalField';

describe('<ConditionalField />', () => {
  it('should render using the render function', () => {
    const record = { foo: true };

    const wrapper = shallow(<ConditionalField
        record={record}
        render={record =>
          (record.foo ?
            <div>foo</div> :
            <span>bar</span>)}
      />);
    assert.equal(wrapper.html(), '<div>foo</div>');
  });
});
