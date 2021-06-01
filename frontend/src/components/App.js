import React, {Component} from 'react';
import {render} from "react-dom";
import {Icon, InlineIcon} from '@iconify/react';
import lockIcon from '@iconify/icons-mdi-light/lock';
import lockUnlocked from '@iconify/icons-mdi-light/lock-unlocked';
import downloadIcon from '@iconify/icons-mdi-light/download';
import deleteIcon from '@iconify/icons-mdi-light/delete';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            placeholder: "Loading",
            code: "",
            alphabet: "",
            shift: "",
            text: "",
            mode: "encode",
            result: "",
            round: "",
            active_button: "encode",
            reference: "default",
            key: ""
        };
        this.handleCryptChange = this.handleCryptChange.bind(this);
        this.handleTextareaChange = this.handleTextareaChange.bind(this);
        this.handleAlphabetChange = this.handleAlphabetChange.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleShiftChange = this.handleShiftChange.bind(this);
        this.handleRoundChange = this.handleRoundChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleKeyChange = this.handleKeyChange.bind(this);
    }

    handleCryptChange(event) {
        event.preventDefault();
        this.setState({code: event.target.value, reference: event.target.value})
    }

    handleTextareaChange(event) {
        event.preventDefault();
        this.setState({text: event.target.value})
    }

    handleAlphabetChange(event) {
        event.preventDefault();
        this.setState({alphabet: event.target.value})
    }

    handleModeChange(event) {
        event.preventDefault();
        this.setState({mode: event.target.id, active_button: event.target.id});
    }

    handleKeyChange(event) {
        event.preventDefault();
        this.setState({key: event.target.value})
    }

    downloadTxtFile = () => {
        if (this.state.result !== "") {
            const element = document.createElement("a");
            const file = new Blob([document.getElementById('result').value],
                {type: 'text/plain;charset=utf-8'});
            element.href = URL.createObjectURL(file);
            element.download = "crypt.txt";
            document.body.appendChild(element);
            element.click();
        }
    }

    makeRequest(data) {
        fetch('http://127.0.0.1:8000/api/crypt/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (res) => {
                    this.setState({
                        loaded: true,
                        result: res.data
                    });
                },
                (error) => {
                    this.setState({
                        loaded: true,
                        error
                    });
                }
            )
    }

    handleSubmit(event) {
        let input;
        event.preventDefault();
        if (this.state.code === "cesar") {
            let isnum = /^\d+$/.test(this.state.shift);
            let input = document.getElementById('shift');
            let errorMes = document.getElementById('shiftErrorMessage');
            if (isnum) {
                input.setAttribute("aria-invalid", "false");
                errorMes.setAttribute("aria-hidden", "true");
                let data = {
                    alphabet: this.state.alphabet,
                    shift: this.state.shift,
                    mode: this.state.mode,
                    code: this.state.code,
                    text: this.state.text
                };
                this.makeRequest(data);
            } else {
                input.setAttribute("aria-invalid", "true");
                errorMes.setAttribute("aria-hidden", "false");
            }
        } else if (this.state.code === "vigener") {
            let data = {
                alphabet: this.state.alphabet,
                key: this.state.key,
                mode: this.state.mode,
                code: this.state.code,
                text: this.state.text
            };
            this.makeRequest(data);
        } else if (this.state.code === "feistel") {
            let isnum = /^\d+$/.test(this.state.round);
            let input = document.getElementById('round');
            let errorMes = document.getElementById('roundErrorMessage');
            if (isnum) {
                input.setAttribute("aria-invalid", "false");
                errorMes.setAttribute("aria-hidden", "true");
                let data = {
                    round: this.state.round,
                    mode: this.state.mode,
                    code: this.state.code,
                    text: this.state.text
                };
                this.makeRequest(data);
            } else {
                input.setAttribute("aria-invalid", "true");
                errorMes.setAttribute("aria-hidden", "false");
            }
        }
    }

    handleShiftChange(event) {
        event.preventDefault();
        this.setState({shift: event.target.value});
    }

    handleRoundChange(event) {
        event.preventDefault();
        this.setState({round: event.target.value});
    }

    handleClear(event) {
        event.preventDefault();
        this.setState({text: "", result: ""});
    }

    render() {
        return (
            <div className="flex-box">
                <form action={""} name={"main"} method={"POST"} onSubmit={this.handleSubmit}>
                    <div className="options">
                        <div className="options-panel">
                            <div className="flex-panel">
                                <div className="panel-option">
                                    <select name="code" required value={this.state.code}
                                            onChange={this.handleCryptChange}>
                                        <option selected hidden>Шифр</option>
                                        <option value="cesar">Шифр Цезаря</option>
                                        <option value="vigener">Шифр Виженера</option>
                                        <option value="feistel">Шифр Фейстеля</option>
                                    </select>
                                </div>
                                <div className="flex-button-panel flex-panel panel-option">
                                    <div className="toggle">
                                        <button
                                            className={this.state.active_button === "encode" ? ("encode-is-active") : ("encode")}
                                            name="mode" value={"encode"} type="button" id="encode"
                                            onClick={this.handleModeChange}>
                                            <Icon role="encode" icon={lockIcon} style={{fontSize: '29px'}} id="encode"/>
                                        </button>
                                        <button
                                            className={this.state.active_button === "decode" ? "decode-is-active" : "decode"}
                                            name="mode" value={"decode"} type="button" id="decode"
                                            onClick={this.handleModeChange}>
                                            <Icon role="decode" icon={lockUnlocked} style={{fontSize: '29px'}}
                                                  id="decode"/>
                                        </button>
                                    </div>
                                    <button type="button" name="clear" className="button-clear"
                                            onClick={this.handleClear}>
                                        <Icon icon={deleteIcon} style={{fontSize: '26px'}}/>
                                    </button>
                                    <button type="button" name="save" className="button-save"
                                            onClick={this.downloadTxtFile}>
                                        <Icon icon={downloadIcon} style={{fontSize: '25px'}}/>
                                    </button>
                                </div>
                            </div>
                            {this.state.code === "cesar" ? (
                                <div className="flex-option-panel flex-panel">
                                    <select className="panel-option" name="alphabet" required
                                            value={this.state.alphabet}
                                            onChange={this.handleAlphabetChange}>
                                        <option selected hidden>Алфавит</option>
                                        <option value="ru">Русский</option>
                                        <option value="en">Английский</option>
                                    </select>
                                    <div className="input-panel-option">
                                        <input type="text" name="shift" id="shift" placeholder="Сдвиг"
                                               required aria-invalid={"false"}
                                               onChange={this.handleShiftChange}/>
                                        <div className="error" id="shiftErrorMessage" aria-hidden="true" role="alert">
                                            <p>Допускаются только цифры</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                this.state.code === "vigener" ? (
                                    <div className="flex-option-panel flex-panel">
                                        <select className="panel-option" name="alphabet" required
                                                value={this.state.alphabet}
                                                onChange={this.handleAlphabetChange}>
                                            <option selected hidden>Алфавит</option>
                                            <option value="ru">Русский</option>
                                            <option value="en">Английский</option>
                                        </select>
                                        <input className="input-key-option" type="text" name="key" placeholder="Ключ"
                                               required
                                               onChange={this.handleKeyChange}/>
                                    </div>
                                ) : this.state.code === "feistel" ? (
                                    <div className="flex-option-panel flex-panel">
                                        <div className="input-panel-option">
                                            <input type="text" id="round" name="round" placeholder="Раундов"
                                                   required aria-invalid={"false"}
                                                   onChange={this.handleRoundChange}/>
                                            <div className="error" id="roundErrorMessage" aria-hidden="true"
                                                 role="alert">
                                                <p>Допускаются только цифры</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="button-panel flex-panel flex-button-panel">
                            <button className="button-crypt" type="submit">Рассчитать
                            </button>
                        </div>
                    </div>
                    <div className="area flex-container">
                            <textarea name="text" placeholder="Исходный текст" value={this.state.text} required
                                      onChange={this.handleTextareaChange}>{this.state.text}</textarea>
                        <textarea name="result" placeholder="Результат" value={this.state.result} id="result"
                                  readOnly={true}>{this.state.result}</textarea>
                    </div>
                </form>
                <aside>
                    <article>
                        <h3>Справка</h3>
                        {this.state.reference === "cesar" ? (
                            <div>
                                <h4>Шифр Цезаря</h4>
                                <p>Шифр Цезаря, также известный как шифр сдвига, код Цезаря или сдвиг Цезаря — один из
                                    самых простых и наиболее широко известных методов шифрования.Шифр Цезаря — это вид
                                    шифра подстановки, в котором каждый символ в открытом тексте заменяется символом,
                                    находящимся на некотором постоянном числе позиций левее или правее него в алфавите.
                                    Например, в шифре со сдвигом вправо на 3, А была бы заменена на Г, Б станет Д, и так
                                    далее.<br/> Параметры:<br/> <span>алфавит</span> - текст какого алфавита
                                    шифруется,<br/> <span>сдвиг</span> - число, на которое будут сдвигаться буквы</p>
                            </div>
                        ) : (this.state.reference === "vigener" ? (
                            <div>
                                <h4>Шифр Виженера</h4>
                                <p>Шифр Виженера — метод полиалфавитного шифрования буквенного текста с использованием
                                    ключевого слова. Суть алгоритма шифрования проста. Шифр Виженера — это
                                    последовательность шифров Цезаря с различными значениями сдвига, определяемых
                                    ключевой фразой, в которой каждая буква слова обозначает требуемый сдвиг, например,
                                    фраза ГДЕ ОН задает такую последовательность шифров Цезаря: 3-4-5-15-14, которая
                                    повторяется, пока не будет зашифрован весь текст сообщения.<br/> Параметры:<br/>
                                    <span>алфавит</span> - текст какого алфавита шифруется, <br/><span>ключ</span> -
                                    слово, на основе которого вычисляется последовательность преобразований</p>
                            </div>
                        ) : (this.state.reference === "feistel" ? (
                                <div>
                                    <h4>Сеть Фейстеля</h4>
                                    <p>Сеть Фейстеля, или конструкция Фейстеля — один из методов построения блочных
                                        шифров. Сеть состоит из ячеек, называемых ячейками Фейстеля. На вход каждой
                                        ячейки поступают данные и ключ. На выходе каждой ячейки получают изменённые
                                        данные и изменённый ключ. Все ячейки однотипны, и говорят, что сеть представляет
                                        собой определённую многократно повторяющуюся (итерированную) структуру. Ключ
                                        выбирается в зависимости от алгоритма шифрования/расшифрования и меняется при
                                        переходе от одной ячейки к другой. При шифровании и расшифровании выполняются
                                        одни и те же операции; отличается только порядок ключей. <br/> Параметры:<br/>
                                        <span>раунды</span> - число итераций шифрования</p>
                                </div>
                            ) : (
                                <div>
                                    <p>Здесь содержится информация о представленных алгоритмах шифрования</p>
                                </div>
                            )
                        ))}
                    </article>
                </aside>
            </div>
        );
    }
}

export default App;

const container = document.getElementById("app");
render(<App/>, container);