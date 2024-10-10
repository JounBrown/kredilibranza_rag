import React from "react";

function Form() {
  return (
    <section id="registro">
      <div className="container">
        <div className="left">
          <img id="Pensionado" src="/img/pensionado.jpeg" alt="Pensionado" />
          <img id="Banner" src="/img/Banner.png" alt="Banner" />
          <div className="card2">
            <span style={{ color: "#ed5621" }}>Atendemos</span>
            clientes pensionados y reportados: descubre nuestros servicios de libranza hoy mismo y en línea.
          </div>
        </div>
        <div className="right">
          <img src="/img/logo sin fondo.png" alt="Kredilibranza Logo" className="logo_registro" />
          <div className="card">
            <h1 id="txtForm">¡TOMA EL CONTROL DE TU VIDA FINANCIERA!</h1>
            <p id="txtForm">Obtén tu crédito rápido y fácil</p>
            <form id="form">
              <div className="form-group">
                <label id="txtForm" htmlFor="nombre_completo">Nombre Completo:</label>
                <input type="text" id="nombre_completo" name="nombre_completo" />
              </div>
              <div className="form-group">
                <label id="txtForm" htmlFor="cedula">Cédula:</label>
                <input type="text" id="cedula" name="cedula" />
              </div>
              <div className="form-group">
                <label id="txtForm" htmlFor="convenio">Convenio:</label>
                <select id="convenio" name="convenio">
                  <option value="option1">Opción 1</option>
                  <option value="option2">Opción 2</option>
                  <option value="option3">Opción 3</option>
                </select>
              </div>
              <div className="form-group">
                <label id="txtForm" htmlFor="telefono">Teléfono:</label>
                <input type="text" id="telefono" name="telefono" />
              </div>
              <div className="form-group">
                <label id="txtForm" htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
                <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" />
              </div>
              <div id="politica_privacidad">
                <input type="checkbox" id="btn_politica_privacidad" name="politica_privacidad" />
                <label htmlFor="politica_privacidad">
                  He leído y acepto <span style={{ color: "#ed5621" }}>la política de privacidad de datos</span>
                </label>
              </div>
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Form;
