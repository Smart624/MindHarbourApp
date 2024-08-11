import { StyleSheet } from 'react-native';
import cores from './colors';

export const estilosGlobais = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 16,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 8,
  },
  texto: {
    fontSize: 16,
    color: cores.texto,
  },
  input: {
    borderWidth: 1,
    borderColor: cores.desativado,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  botao: {
    backgroundColor: cores.primaria,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  botaoTexto: {
    color: cores.textoBranco,
    fontSize: 18,
    fontWeight: '600',
  },
  erro: {
    color: cores.erro,
    fontSize: 14,
    marginTop: 4,
  },
});

export default estilosGlobais;