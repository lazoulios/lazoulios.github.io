document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.info-block');
    const revealOnScroll = () => {
        blocks.forEach(block => {
            const rect = block.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                block.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); 

    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const block = btn.closest('.info-block');
            block.classList.toggle('expanded');
        });
    });
});