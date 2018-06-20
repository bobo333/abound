import React from 'react';

export function InputForm(props) {
    return (
        <form onSubmit={props.onSubmit}>
          {props.name}
          <div className='income-input'>
            <input type='text' placeholder={props.placeholder}
                   value={props.value} onChange={props.onChange} />
            <br/>
            {props.backOnClick && <input type='button' value='Back' onClick={props.backOnClick} />}
            <input type='submit' value='Next' />
          </div>
        </form>
    );
}
