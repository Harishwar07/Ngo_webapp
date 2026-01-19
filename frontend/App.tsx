
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ListView } from './components/ListView';
import { DetailView } from './components/DetailView';
import { EditorView } from './components/EditorView';
import { LoginView } from './components/LoginView';
import type { FrfEntity, AnyRecord } from './types';
import { FRF_ENTITIES, NGO_ICON } from './constants';
import { Header } from './components/Header';
import { useEffect } from "react";
import { loadCsrfToken } from "./services/mockApi";

type ViewState = 
  | { mode: 'welcome' }
  | { mode: 'login' }
  | { mode: 'list'; entity: FrfEntity }
  | { mode: 'create'; entity: FrfEntity }
  | { mode: 'edit'; entity: FrfEntity; record: AnyRecord }
  | { mode: 'detail'; entity: FrfEntity; id: string };

const App: React.FC = () => {
  const [is_logged_in, set_is_logged_in] = useState(false);
  const [view_state, set_view_state] = useState<ViewState>({ mode: 'welcome' });
  const [selected_entity_id, set_selected_entity_id] = useState<FrfEntity['id'] | null>(null);
  const [is_sidebar_open, set_sidebar_open] = useState(false);
  const [detailReloadKey, setDetailReloadKey] = useState(0); // 🔥 FORCE DETAIL RELOAD


  useEffect(() => {
    loadCsrfToken();
  }, []);

  const handle_login_success = () => {
      set_is_logged_in(true);
      set_view_state({ mode: 'welcome' });
  };
  
  const handle_login_click = () => set_view_state({ mode: 'login' });

  const handle_logout = () => {
      set_is_logged_in(false);
      set_view_state({ mode: 'welcome' });
      set_selected_entity_id(null);
  };

  const handle_select_entity = (entity: FrfEntity) => {
    if (!is_logged_in) {
        set_view_state({ mode: 'login' });
        set_sidebar_open(false);
        return;
    }
    set_selected_entity_id(entity.id);
    set_view_state({ mode: 'list', entity });
    set_sidebar_open(false);
  };

  const handle_select_record = (id: string) => {
    if (view_state.mode === 'list') {
      set_view_state({ mode: 'detail', entity: view_state.entity, id });
    }
  };

  const handle_create_click = () => {
      if (view_state.mode === 'list') {
          set_view_state({ mode: 'create', entity: view_state.entity });
      }
  };

  const handle_edit_click = (record: AnyRecord) => {
    if ('entity' in view_state) {
      set_view_state({
        mode: 'edit',
        entity: view_state.entity,
        id: record.id
      });
    }
  };


  const handle_back_to_list = () => {
    if ('entity' in view_state) {
        set_view_state({ mode: 'list', entity: view_state.entity });
    }
  };

  const render_content = () => {
    switch (view_state.mode) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 mb-4 text-indigo-500">{NGO_ICON}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700">NGO Data Hub</h1>
            <p className="mt-2 text-gray-500 mb-8">Centralized record management for mission-driven teams.</p>
            {!is_logged_in && (
                 <button onClick={handle_login_click} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">Login to Access</button>
            )}
          </div>
        );
      case 'list':
        return <ListView entity={view_state.entity} on_select_record={handle_select_record} on_create_click={handle_create_click} on_edit_click={handle_edit_click} />;
      case 'detail':
        return <DetailView entity={view_state.entity} id={view_state.id} reloadKey={detailReloadKey} on_back={handle_back_to_list} on_edit={handle_edit_click} on_delete_success={handle_back_to_list} />;
      case 'create':
        return <EditorView entity={view_state.entity} on_cancel={handle_back_to_list} on_save_success={() => {
          setDetailReloadKey(prev => prev + 1);
          handle_back_to_list();
        }}
        />;
      case 'edit':
        return (
          <EditorView
            entity={view_state.entity}
            id={view_state.id}
            on_cancel={handle_back_to_list}
            on_save_success={handle_back_to_list}
          />
        );


      default: return null;
    }
  };

  if (view_state.mode === 'login') return <LoginView on_login={handle_login_success} on_cancel={() => set_view_state({ mode: 'welcome' })} />;

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {is_sidebar_open && <div onClick={() => set_sidebar_open(false)} className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" />}
      <Sidebar entities={FRF_ENTITIES} selected_entity={FRF_ENTITIES.find(e => e.id === selected_entity_id) || null} on_select_entity={handle_select_entity} is_open={is_sidebar_open} set_is_open={set_sidebar_open} />
      <div className={`flex-1 flex flex-col transition-all duration-300 md:ml-64`}>
        <Header on_toggle_sidebar={() => set_sidebar_open(!is_sidebar_open)} is_sidebar_open={is_sidebar_open} title={view_state.mode === 'edit' ? 'Edit Record' : 'Data Hub'} entity_name={'entity' in view_state ? view_state.entity.name : undefined} on_logout={is_logged_in ? handle_logout : undefined} on_login={!is_logged_in ? handle_login_click : undefined} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{render_content()}</main>
      </div>
    </div>
  );
};
export default App;
