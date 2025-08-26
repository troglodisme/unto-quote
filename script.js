let selectedTier = { years: 3, discount: 8 };

// Set today's date when page loads
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('quoteDate').value = new Date().toISOString().split('T')[0];
    updateQuote();
});

// Handle tier selection
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tier').forEach(tier => {
        tier.addEventListener('click', function() {
            document.querySelectorAll('.tier').forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
            selectedTier = {
                years: parseInt(this.dataset.years),
                discount: parseInt(this.dataset.discount)
            };
            updateQuote();
        });
    });
});

// Update quote when inputs change
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', updateQuote);
    });
});

function updateQuote() {
    const smallCansBoxes = parseFloat(document.getElementById('smallCansBoxes').value) || 0;
    const smallCansFrequency = parseFloat(document.getElementById('smallCansFrequency').value) || 1;
    const smallCansPrice = parseFloat(document.getElementById('smallCansPrice').value) || 0;
    
    const mediumCansBoxes = parseFloat(document.getElementById('mediumCansBoxes').value) || 0;
    const mediumCansFrequency = parseFloat(document.getElementById('mediumCansFrequency').value) || 1;
    const mediumCansPrice = parseFloat(document.getElementById('mediumCansPrice').value) || 0;
    
    const largeContainerSize = parseInt(document.getElementById('largeContainerSize').value);
    const largeLitersWeek = parseFloat(document.getElementById('largeLitersWeek').value) || 0;
    const largePricePerLiter = parseFloat(document.getElementById('largePricePerLiter').value) || 0;
    
    // Calculate monthly quantities
    const smallCansPerMonth = (smallCansBoxes * 24) * (4.33 / smallCansFrequency);
    const mediumCansPerMonth = (mediumCansBoxes * 12) * (4.33 / mediumCansFrequency);
    const largeLitersPerMonth = largeLitersWeek * 4.33;
    const largeContainersPerMonth = largeLitersPerMonth / largeContainerSize;
    
    // Calculate base prices
    const smallCansMonthlyBase = smallCansPerMonth * smallCansPrice;
    const mediumCansMonthlyBase = mediumCansPerMonth * mediumCansPrice;
    const largeLitersMonthlyBase = largeLitersPerMonth * largePricePerLiter;
    
    // Apply discount
    const discountMultiplier = (100 - selectedTier.discount) / 100;
    const smallCansMonthly = smallCansMonthlyBase * discountMultiplier;
    const mediumCansMonthly = mediumCansMonthlyBase * discountMultiplier;
    const largeLitersMonthly = largeLitersMonthlyBase * discountMultiplier;
    
    const totalMonthly = smallCansMonthly + mediumCansMonthly + largeLitersMonthly;
    const totalAnnual = totalMonthly * 12;
    const totalSavings = ((smallCansMonthlyBase + mediumCansMonthlyBase + largeLitersMonthlyBase) * 12) - totalAnnual;
    
    // Update table
    const tbody = document.getElementById('quoteBody');
    let tableRows = '';
    
    if (smallCansBoxes > 0) {
        tableRows += `
            <tr>
                <td>Small Cans (250ml)</td>
                <td>${smallCansPerMonth.toFixed(0)} cans</td>
                <td>€${smallCansPrice.toFixed(2)}</td>
                <td>Every ${smallCansFrequency} weeks</td>
                <td>€${smallCansMonthly.toFixed(2)}</td>
                <td>€${(smallCansMonthly * 12).toFixed(2)}</td>
            </tr>
        `;
    }
    
    if (mediumCansBoxes > 0) {
        tableRows += `
            <tr>
                <td>Medium Cans (500ml)</td>
                <td>${mediumCansPerMonth.toFixed(0)} cans</td>
                <td>€${mediumCansPrice.toFixed(2)}</td>
                <td>Every ${mediumCansFrequency} weeks</td>
                <td>€${mediumCansMonthly.toFixed(2)}</td>
                <td>€${(mediumCansMonthly * 12).toFixed(2)}</td>
            </tr>
        `;
    }
    
    if (largeLitersWeek > 0) {
        tableRows += `
            <tr>
                <td>Large Containers (${largeContainerSize}L)</td>
                <td>${largeContainersPerMonth.toFixed(1)} containers (${largeLitersPerMonth.toFixed(0)}L)</td>
                <td>€${largePricePerLiter.toFixed(2)}/L</td>
                <td>Weekly</td>
                <td>€${largeLitersMonthly.toFixed(2)}</td>
                <td>€${(largeLitersMonthly * 12).toFixed(2)}</td>
            </tr>
        `;
    }
    
    if (totalMonthly > 0) {
        tableRows += `
            <tr class="total-row">
                <td colspan="4"><strong>TOTAL (${selectedTier.years} Year Contract - ${selectedTier.discount}% Discount)</strong></td>
                <td><strong>€${totalMonthly.toFixed(2)}</strong></td>
                <td><strong>€${totalAnnual.toFixed(2)}</strong></td>
            </tr>
        `;
        
        if (totalSavings > 0) {
            tableRows += `
                <tr class="savings-row">
                    <td colspan="5"><strong>Annual Savings with Contract</strong></td>
                    <td><strong>€${totalSavings.toFixed(2)}</strong></td>
                </tr>
            `;
        }
    }
    
    tbody.innerHTML = tableRows;
}

function generatePDF() {
    const clientName = document.getElementById('clientName').value || 'Valued Client';
    const contactPerson = document.getElementById('contactPerson').value || '';
    const email = document.getElementById('email').value || '';
    const quoteDate = document.getElementById('quoteDate').value || new Date().toISOString().split('T')[0];
    
    // Create a new window with the quote content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Unto Toscano - Quote for ${clientName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid rgb(71, 114, 88); padding-bottom: 20px; }
                .header img { max-width: 200px; margin-bottom: 20px; }
                .header h1 { color: rgb(71, 114, 88); font-size: 2rem; margin: 0; }
                .header p { margin: 10px 0; font-size: 1.1rem; }
                .client-info { margin-bottom: 30px; background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; }
                .quote-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .quote-table th, .quote-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                .quote-table th { background: rgb(71, 114, 88); color: white; }
                .total-row { background: #e8f0ec; font-weight: bold; }
                .savings-row { background: #fff8f6; color: rgb(255, 98, 54); font-weight: bold; }
                .contract-terms { margin-top: 30px; background: #f0f8f4; padding: 20px; border: 1px solid rgb(71, 114, 88); }
                .footer { margin-top: 40px; text-align: center; color: #666; border-top: 1px solid #e0e0e0; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="https://unto-toscano.com/cdn/shop/files/Artboard_3_4x_19f8842a-c1f2-4e49-a274-bd407461e8b8.png?v=1670781079&width=500" alt="Unto Toscano">
                <h1>COMMERCIAL QUOTE</h1>
                <p>Quote Date: ${new Date(quoteDate).toLocaleDateString()}</p>
            </div>
            
            <div class="client-info">
                <h3>Quote For:</h3>
                <p><strong>Client:</strong> ${clientName}</p>
                ${contactPerson ? `<p><strong>Contact:</strong> ${contactPerson}</p>` : ''}
                ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
            </div>
            
            ${document.querySelector('.quote-table').outerHTML}
            
            <div class="contract-terms">
                <h3>Exclusivity Agreement - ${selectedTier.years} Years</h3>
                <ul>
                    <li><strong>${selectedTier.discount}% Discount</strong> on all orders</li>
                    <li>Custom labeling with your logo included</li>
                    <li>Dedicated account management</li>
                    <li>Priority delivery scheduling</li>
                    <li>Price protection against market fluctuations</li>
                    <li>Minimum purchase commitment as outlined above</li>
                    <li>90-day notice required for contract termination</li>
                </ul>
            </div>
            
            <div class="footer">
                <p><strong>Unto Toscano</strong> | Premium Olive Oil</p>
                <p>This quote is valid for 30 days from the date above</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
}