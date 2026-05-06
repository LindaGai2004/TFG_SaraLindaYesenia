package seguridad.model.dto;

public class IngresoMensualDto {
	    private int mes; // 1-12
	    private double totalLibros;
	    private double totalPapelerias;

	    public IngresoMensualDto(int mes, double totalLibros, double totalPapelerias) {
	        this.mes = mes;
	        this.totalLibros = totalLibros;
	        this.totalPapelerias = totalPapelerias;
	    }

	    public int getMes() { 
	    	return mes; 
	    	}
	    public double getLibros() { 
	    	return totalLibros; 
	    	}
	    public double getPapeleria() { 
	    	return totalPapelerias; 
	    	}
	    public double getTotal() { 
	    	return totalLibros + totalPapelerias; 
	    	}

	    public void addLibros(double amount) { 
	    	this.totalLibros += amount;
	    	}
	    
	    public void addPapeleria(double amount) {
	    	this.totalPapelerias += amount; 
	    	}
	
}


