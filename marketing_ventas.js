document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checklistForm');
    const calculateBtn = document.getElementById('calculateSummaryBtn');
    const totalScoreSpan = document.getElementById('totalScore');
    const maxScoreSpan = document.getElementById('maxScore');
    const compliancePercentageSpan = document.getElementById('compliancePercentage');
    const globalObservationsTextarea = document.getElementById('globalObservations');

    let chartInstance = null; // Para almacenar la instancia del gráfico y destruirla si existe

    // Configuración para el gráfico (colores, etiquetas)
    const chartLabels = ['Malo (0)', 'Regular (1)', 'Bueno (2)', 'Excelente (3)'];
    const chartColors = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db']; // Rojo, Naranja, Verde, Azul

    const totalQuestions = 25; // Son 25 actividades para Marketing y Ventas

    // Función para calcular y actualizar el resumen
    function updateSummary() {
        let totalScore = 0;
        let answeredQuestions = 0;
        const complianceCounts = { 0: 0, 1: 0, 2: 0, 3: 0 }; // Contador para cada nivel

        // Iterar sobre todos los grupos de radio buttons
        for (let i = 1; i <= totalQuestions; i++) {
            const radios = form.elements[`q${i}`];
            if (radios) { // Asegurarse de que el grupo de radios existe
                let selectedValue = null;
                // Encontrar el valor seleccionado en el grupo
                for (const radio of radios) {
                    if (radio.checked) {
                        selectedValue = parseInt(radio.value);
                        break;
                    }
                }

                if (selectedValue !== null) {
                    totalScore += selectedValue;
                    answeredQuestions++;
                    complianceCounts[selectedValue]++; // Incrementar contador para el nivel
                }
            }
        }

        const maxPossibleScore = totalQuestions * 3; // 3 es la puntuación máxima por pregunta
        const percentage = answeredQuestions > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

        totalScoreSpan.textContent = totalScore;
        maxScoreSpan.textContent = maxPossibleScore;
        compliancePercentageSpan.textContent = percentage.toFixed(2) + '%'; // Formatear 2 decimales

        // Actualizar o crear el gráfico
        updateChart(complianceCounts);
    }

    // Función para crear/actualizar el gráfico
    function updateChart(dataCounts) {
        const ctx = document.getElementById('complianceChart').getContext('2d');

        // Destruir instancia anterior si existe
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'pie', // O 'bar' si prefieres barras
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Nivel de Cumplimiento',
                    data: [dataCounts[0], dataCounts[1], dataCounts[2], dataCounts[3]],
                    backgroundColor: chartColors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Permite que el gráfico se ajuste al contenedor
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de Cumplimiento por Nivel',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed + ' preguntas';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Event listener para el botón de cálculo
    calculateBtn.addEventListener('click', updateSummary);

    // Opcional: Actualizar resumen cada vez que un radio button cambia (más dinámico)
    form.addEventListener('change', (event) => {
        if (event.target.type === 'radio') {
            updateSummary();
        }
    });

    // Inicializar el resumen y el gráfico al cargar la página
    updateSummary();
});