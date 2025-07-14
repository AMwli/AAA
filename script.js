document.addEventListener('DOMContentLoaded', function() {
    // Todos los cursos del primer semestre están disponibles inicialmente
    const firstSemesterCourses = document.querySelectorAll('#semester1 .course');
    firstSemesterCourses.forEach(course => {
        course.classList.remove('locked');
        course.classList.add('available');
    });

    // Agregar event listeners a todos los cursos disponibles
    document.addEventListener('click', function(e) {
        const course = e.target.closest('.course');
        if (!course || course.classList.contains('locked')) return;

        // Alternar estado de aprobado
        course.classList.toggle('approved');
        
        // Si se aprueba, desbloquear los cursos que abre
        if (course.classList.contains('approved')) {
            const opens = course.getAttribute('data-opens');
            if (opens) {
                const coursesToUnlock = opens.split(' ');
                coursesToUnlock.forEach(courseId => {
                    const elements = document.querySelectorAll(`[data-id="${courseId}"]`);
                    elements.forEach(el => {
                        el.classList.remove('locked');
                        el.classList.add('available');
                    });
                });
            }
        } else {
            // Si se desaprueba, verificar si hay cursos dependientes que deberían bloquearse
            const courseId = course.getAttribute('data-id');
            const allCourses = document.querySelectorAll('.course');
            
            allCourses.forEach(otherCourse => {
                const opens = otherCourse.getAttribute('data-opens');
                if (opens && opens.includes(courseId)) {
                    if (otherCourse.classList.contains('approved')) {
                        // Si el curso dependiente estaba aprobado, desaprobarlo
                        otherCourse.classList.remove('approved');
                    }
                    // Verificar si todavía hay algún requisito aprobado
                    const allRequirements = opens.split(' ');
                    let hasApprovedRequirement = false;
                    
                    allRequirements.forEach(req => {
                        const reqElements = document.querySelectorAll(`[data-id="${req}"]`);
                        reqElements.forEach(reqEl => {
                            if (reqEl.classList.contains('approved')) {
                                hasApprovedRequirement = true;
                            }
                        });
                    });
                    
                    if (!hasApprovedRequirement) {
                        otherCourse.classList.add('locked');
                        otherCourse.classList.remove('available');
                    }
                }
            });
        }
    });

    // Efecto hover mejorado
    const courses = document.querySelectorAll('.course');
    courses.forEach(course => {
        course.addEventListener('mouseenter', function() {
            if (!this.classList.contains('locked')) {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
            }
        });
        
        course.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
});
