import { NextPage } from "next";
import { useState } from "react";
import Select from 'react-select';

const Dropdown: NextPage<any> = (props) => {
	const [option, setOption] = useState(props.option[0]);

	const changeValue = (event: any) => {
		setOption(event.value);
		props.sendValue(event.value);
	}

	const customStyles = {
		menu: (provided: any, state: any) => ({
			...provided,
			background: '#2F325A',
		}),
		control: (base: any, state: any) => ({
			...base,
			background: '#2F325A',
			border: 0
		}),
		singleValue: (base: any, state: any) => ({
			...base,
			color: 'white',
		}),
		option: (base: any, state: any) => ({
			...base,
			backgroundColor: state.isSelected ? '#202342' : '#2F325A',
		})
	}

	return (
		<div>
			<Select
				onChange={changeValue}
				styles={customStyles}
				defaultValue={{ value: option.value, label: option.label }}
				options={props.option}
			/>
		</div>
	)
}

export default Dropdown