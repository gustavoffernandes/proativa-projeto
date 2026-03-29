import { useState, useEffect, useCallback } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";

const ONBOARDING_KEY = "proativa_onboarding_done";

export function useOnboarding(userId: string | undefined) {
  const [shouldRun, setShouldRun] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const key = `${ONBOARDING_KEY}_${userId}`;
    const done = localStorage.getItem(key);
    if (!done) {
      // Small delay to let the DOM render
      const timer = setTimeout(() => setShouldRun(true), 800);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  const startTour = useCallback(() => {
    if (!userId) return;

    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: '[data-onboarding="sidebar-logo"]',
          intro: `
            <div style="text-align:center">
              <h3 style="margin:0 0 8px;font-weight:700;font-size:16px">Bem-vindo ao PROATIVA! 🎉</h3>
              <p style="margin:0;font-size:13px;opacity:0.85">Vamos fazer um tour rápido pelas principais funcionalidades do sistema.</p>
            </div>
          `,
          position: "right",
        },
        {
          element: '[data-onboarding="menu-visao-geral"]',
          intro: `
            <h3 style="margin:0 0 6px;font-weight:700;font-size:14px">📊 Visão Geral</h3>
            <p style="margin:0;font-size:13px">Painel principal com KPIs, gráficos de fatores de risco e métricas consolidadas de todas as pesquisas.</p>
          `,
          position: "right",
        },
        {
          element: '[data-onboarding="menu-analise"]',
          intro: `
            <h3 style="margin:0 0 6px;font-weight:700;font-size:14px">📋 Análise por Pergunta</h3>
            <p style="margin:0;font-size:13px">Veja a distribuição das respostas por pergunta individual, com gráficos detalhados e filtros.</p>
          `,
          position: "right",
        },
        {
          element: '[data-onboarding="menu-heatmap"]',
          intro: `
            <h3 style="margin:0 0 6px;font-weight:700;font-size:14px">🗺️ Heatmap de Satisfação</h3>
            <p style="margin:0;font-size:13px">Mapa de calor que cruza fatores e setores, facilitando a identificação de áreas críticas.</p>
          `,
          position: "right",
        },
        {
          element: '[data-onboarding="menu-evolucao"]',
          intro: `
            <h3 style="margin:0 0 6px;font-weight:700;font-size:14px">📈 Evolução Temporal</h3>
            <p style="margin:0;font-size:13px">Compare resultados entre diferentes formulários/períodos para acompanhar a evolução da empresa.</p>
          `,
          position: "right",
        },
        {
          element: '[data-onboarding="menu-relatorios"]',
          intro: `
            <h3 style="margin:0 0 6px;font-weight:700;font-size:14px">📄 Relatórios</h3>
            <p style="margin:0;font-size:13px">Exporte relatórios completos em PDF com todos os dados e gráficos da pesquisa.</p>
          `,
          position: "right",
        },
        {
          element: '[data-onboarding="menu-plano-acao"]',
          intro: `
            <h3 style="margin:0 0 6px;font-weight:700;font-size:14px">✅ Plano de Ação</h3>
            <p style="margin:0;font-size:13px">Crie e acompanhe planos de ação baseados nos riscos identificados nas pesquisas.</p>
          `,
          position: "right",
        },
        {
          element: '[data-onboarding="menu-configuracoes"]',
          intro: `
            <h3 style="margin:0 0 6px;font-weight:700;font-size:14px">⚙️ Configurações</h3>
            <p style="margin:0;font-size:13px">Gerencie usuários, permissões e outras configurações do sistema.</p>
          `,
          position: "right",
        },
      ],
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      showStepNumbers: false,
      nextLabel: "Próximo →",
      prevLabel: "← Anterior",
      doneLabel: "Concluir ✓",
      skipLabel: "Pular",
      tooltipClass: "proativa-onboarding-tooltip",
      highlightClass: "proativa-onboarding-highlight",
      overlayOpacity: 0.6,
    });

    intro.oncomplete(() => {
      localStorage.setItem(`${ONBOARDING_KEY}_${userId}`, "true");
      setShouldRun(false);
    });

    intro.onexit(() => {
      localStorage.setItem(`${ONBOARDING_KEY}_${userId}`, "true");
      setShouldRun(false);
    });

    intro.start();
  }, [userId]);

  useEffect(() => {
    if (shouldRun) {
      startTour();
    }
  }, [shouldRun, startTour]);

  const restartTour = useCallback(() => {
    if (userId) {
      localStorage.removeItem(`${ONBOARDING_KEY}_${userId}`);
      startTour();
    }
  }, [userId, startTour]);

  return { restartTour };
}
